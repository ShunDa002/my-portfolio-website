"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Terminal } from "lucide-react";
import {
  extractYouTubeVideoId,
  formatTime,
  loadYouTubeIframeApi,
  YouTubePlayer,
  YouTubePlayerState,
} from "@/lib/video";

interface DialogVideoPlayerProps {
  videoUrl?: string;
  title: string;
}

export const DialogVideoPlayer: React.FC<DialogVideoPlayerProps> = ({
  videoUrl,
  title,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrubbingRef = useRef<boolean>(false);

  const videoId = videoUrl ? extractYouTubeVideoId(videoUrl) : null;
  const playerIframeId = useRef(
    `yt-player-${videoId || "fallback"}-${Math.random().toString(36).substring(2, 7)}`
  ).current;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Send command to YouTube player via both YT.Player instance and direct iframe postMessage
  const sendPlayerCommand = useCallback((func: string, args: unknown[] = []) => {
    // 1. Direct postMessage to iframe (always works for enablejsapi=1, zero external script dependency)
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func,
            args,
          }),
          "*"
        );
      } catch (err) {
        console.warn("YouTube postMessage error:", err);
      }
    }

    // 2. YT.Player API instance if available
    if (
      playerRef.current &&
      typeof (playerRef.current as Record<string, unknown>)[func] === "function"
    ) {
      try {
        ((playerRef.current as Record<string, unknown>)[func] as (...a: unknown[]) => void)(
          ...args
        );
      } catch (err) {
        console.warn("YouTube playerRef error:", err);
      }
    }
  }, []);

  // Clear polling interval
  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Poll progress while video is playing (stable reference with NO dependencies on state)
  const startProgressInterval = useCallback(() => {
    clearProgressInterval();
    progressIntervalRef.current = setInterval(() => {
      if (isScrubbingRef.current) return;

      if (playerRef.current) {
        try {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          if (typeof current === "number" && !isNaN(current)) {
            setCurrentTime(current);
          }
          if (typeof total === "number" && !isNaN(total) && total > 0) {
            setDuration(total);
          }
        } catch {
          // Transitioning state
        }
      } else if (iframeRef.current && iframeRef.current.contentWindow) {
        // Ping iframe to deliver info
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "listening" }),
            "*"
          );
        } catch {
          // Ignore
        }
      }
    }, 250);
  }, [clearProgressInterval]);

  // Toggle play/pause with instant UI update
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) {
        sendPlayerCommand("unMute");
        sendPlayerCommand("playVideo");
      } else {
        sendPlayerCommand("pauseVideo");
      }
      return next;
    });
  }, [sendPlayerCommand]);

  // Seek video to specific timestamp
  const seekVideo = useCallback(
    (seconds: number) => {
      setCurrentTime(seconds);
      sendPlayerCommand("seekTo", [seconds, true]);
    },
    [sendPlayerCommand]
  );

  // Scrubber events
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    seekVideo(newTime);
  };

  const handleScrubberPointerDown = () => {
    isScrubbingRef.current = true;
    setIsScrubbing(true);
    clearProgressInterval();
  };

  const handleScrubberPointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
    isScrubbingRef.current = false;
    setIsScrubbing(false);
    const newTime = parseFloat(e.currentTarget.value);
    seekVideo(newTime);
    if (isPlaying) {
      startProgressInterval();
    }
  };

  // Global window pointerup so dragging outside the scrubber commits cleanly
  useEffect(() => {
    const onWindowPointerUp = () => {
      if (isScrubbingRef.current) {
        isScrubbingRef.current = false;
        setIsScrubbing(false);
        if (isPlaying) {
          startProgressInterval();
        }
      }
    };
    window.addEventListener("pointerup", onWindowPointerUp);
    return () => window.removeEventListener("pointerup", onWindowPointerUp);
  }, [isPlaying, startProgressInterval]);

  // Listen for YouTube postMessage events (onStateChange, infoDelivery)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        typeof event.origin === "string" &&
        !event.origin.includes("youtube.com") &&
        !event.origin.includes("youtube-nocookie.com")
      ) {
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.event === "onReady" || data.event === "initialDelivery") {
          sendPlayerCommand("addEventListener", ["onStateChange"]);
          sendPlayerCommand("addEventListener", ["infoDelivery"]);
          sendPlayerCommand("unMute");
          sendPlayerCommand("playVideo");
        }

        if (data.event === "onStateChange") {
          const state = data.info;
          if (state === 1) {
            // PLAYING
            setIsPlaying(true);
            startProgressInterval();
          } else if (state === 2 || state === 0) {
            // PAUSED or ENDED
            setIsPlaying(false);
            clearProgressInterval();
          }
        }

        if (data.event === "infoDelivery" && data.info) {
          if (typeof data.info.playerState === "number") {
            const state = data.info.playerState;
            if (state === 1) {
              setIsPlaying(true);
            } else if (state === 2 || state === 0) {
              setIsPlaying(false);
            }
          }
          if (typeof data.info.duration === "number" && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          if (
            typeof data.info.currentTime === "number" &&
            !isNaN(data.info.currentTime) &&
            !isScrubbingRef.current
          ) {
            setCurrentTime(data.info.currentTime);
          }
        }
      } catch {
        // Non-JSON message from other sources
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [sendPlayerCommand, startProgressInterval, clearProgressInterval]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k" || e.key === "K") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const nextTime = Math.max(0, currentTime - 5);
      seekVideo(nextTime);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextTime = Math.min(duration, currentTime + 5);
      seekVideo(nextTime);
    }
  };

  // Main player lifecycle: runs ONLY once when videoId mounts
  useEffect(() => {
    if (!videoId) return;

    let isSubscribed = true;

    // Send initial listening signal after mount
    const initTimeout = setTimeout(() => {
      if (isSubscribed && iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "listening" }),
            "*"
          );
        } catch {
          // Ignore
        }
      }
    }, 400);

    // Optional progressive enhancement with YT.Player API
    loadYouTubeIframeApi()
      .then(() => {
        if (!isSubscribed || !iframeRef.current) return;

        // @ts-expect-error - YT global loaded dynamically
        if (!window.YT || !window.YT.Player) return;

        try {
          // @ts-expect-error - YT global loaded dynamically
          playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
              onReady: (event: { target: YouTubePlayer }) => {
                if (!isSubscribed) return;
                try {
                  const total = event.target.getDuration();
                  if (total) setDuration(total);
                  event.target.mute();
                  event.target.playVideo();
                } catch {
                  // Autoplay policy
                }
              },
              onStateChange: (event: { data: number }) => {
                if (!isSubscribed) return;
                const state = event.data;
                if (state === YouTubePlayerState.PLAYING) {
                  setIsPlaying(true);
                  startProgressInterval();
                } else if (
                  state === YouTubePlayerState.PAUSED ||
                  state === YouTubePlayerState.ENDED
                ) {
                  setIsPlaying(false);
                  clearProgressInterval();
                }
              },
            },
          });
        } catch (err) {
          console.warn("YouTube Player initialization warning:", err);
        }
      })
      .catch(() => {
        // Fallback postMessage handles commands
      });

    startProgressInterval();

    return () => {
      isSubscribed = false;
      clearTimeout(initTimeout);
      clearProgressInterval();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
        playerRef.current = null;
      }
    };
  }, [videoId, clearProgressInterval, startProgressInterval]);

  // If no valid video ID was provided, render designed fallback
  if (!videoId) {
    return (
      <div className="w-full h-full bg-linear-to-br from-slate-900 via-midnight to-slate-950 flex flex-col items-center justify-center p-6 text-center rounded-xl border border-slate-700/70 shadow-2xl">
        <div className="p-4 rounded-full bg-cyan-950/60 border border-cyan-800/60 mb-3 shadow-lg shadow-cyan-950/40">
          <Terminal className="w-12 h-12 text-cyan-glow" />
        </div>
        <span className="text-sm font-mono text-slate-300">
          Demonstration available in repository
        </span>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      role="region"
      aria-label={`${title} video demonstration player`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group/player relative w-full h-full rounded-xl overflow-hidden bg-slate-950 border border-slate-700/70 shadow-2xl select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/60"
    >
      {/* Underlying YouTube Embed with controls disabled, scaled to crop YouTube top/bottom chrome */}
      <iframe
        ref={iframeRef}
        key={videoId}
        id={playerIframeId}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
        title={`${title} demonstration video player`}
        className="w-full h-full scale-[1.35] origin-center pointer-events-none border-0"
        tabIndex={-1}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      {/* Interactive Overlay Target (click anywhere on the video surface to toggle play/pause) */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 cursor-pointer z-10"
        aria-hidden="true"
      />

      {/* Center Playback Control: Play/Pause Button */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-opacity duration-300 ${
          !isPlaying || isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="pointer-events-auto flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/85 backdrop-blur-xl border border-cyan-500/50 text-cyan-glow shadow-2xl shadow-cyan-950/80 hover:scale-110 active:scale-95 hover:border-cyan-400 hover:text-white transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
          ) : (
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Timeline & Bottom Controls: Time Counter and Progress Bar / Scrubber */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
          !isPlaying || isHovering || isScrubbing ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-2 w-full">
          {/* Progress Bar / Scrubber */}
          <div className="relative w-full flex items-center group/scrubber py-1">
            {/* Visual Track */}
            <div className="relative w-full h-1.5 sm:h-2 bg-slate-800/90 rounded-full overflow-hidden transition-all duration-150 group-hover/scrubber:h-2.5">
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-75 shadow-sm shadow-cyan-500/50"
                style={{
                  width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                }}
              />
            </div>

            {/* Interactive Range Input overlay */}
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 100}
              step={0.1}
              value={currentTime}
              onChange={handleScrubberChange}
              onPointerDown={handleScrubberPointerDown}
              onPointerUp={handleScrubberPointerUp}
              aria-label="Seek video scrubber"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
            />
          </div>

          {/* Time Counter */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-300 font-medium">
            <span className="tracking-wider">
              <span className="text-cyan-glow">{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span>{formatTime(duration)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
