export type YouTubeEmbedOptions = {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsinline?: boolean;
  disablekb?: boolean;
  modestbranding?: boolean;
  rel?: boolean;
};

export type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getDuration: () => number;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
};

export const YouTubePlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

/**
 * Formats a time in seconds into mm:ss (or hh:mm:ss if >= 1 hour).
 */
export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

let apiPromise: Promise<void> | null = null;

/**
 * Loads the YouTube IFrame API script tag once and resolves when window.YT.Player is available.
 */
export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  // @ts-expect-error - YT is attached globally by YouTube script
  if (window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScript = document.getElementsByTagName("script")[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(tag, firstScript);
        } else {
          document.head.appendChild(tag);
        }
      }

      // @ts-expect-error - global callback expected by YouTube
      const prevCallback = window.onYouTubeIframeAPIReady;
      // @ts-expect-error - global callback expected by YouTube
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === "function") {
          prevCallback();
        }
        resolve();
      };

      const interval = setInterval(() => {
        // @ts-expect-error - YT check
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  return apiPromise;
}

/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * (e.g., youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>).
 * Returns null if invalid or missing.
 */
export function extractYouTubeVideoId(url?: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  return match && match[1] ? match[1] : null;
}

/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * and returns a privacy-enhanced embed URL (youtube-nocookie.com).
 * By default, configures the preview to autoplay automatically (muted and looped)
 * with controls and overlays hidden for a clean video showcase.
 * Returns null if the URL is invalid, empty, or does not contain a valid YouTube ID.
 */
export function getYouTubeEmbedUrl(
  url?: string,
  options: YouTubeEmbedOptions = {
    autoplay: true,
    mute: true,
    loop: true,
    playsinline: true,
    controls: false,
    disablekb: true,
    modestbranding: true,
    rel: false,
  }
): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }

  const params = new URLSearchParams();

  if (options.autoplay) {
    params.set("autoplay", "1");
    // Browser autoplay policies require video to be muted to autoplay
    params.set("mute", "1");
  } else if (options.mute) {
    params.set("mute", "1");
  }

  if (options.loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  if (options.playsinline !== false) {
    params.set("playsinline", "1");
  }

  if (options.controls === false) {
    params.set("controls", "0");
  }

  if (options.disablekb) {
    params.set("disablekb", "1");
  }

  if (options.modestbranding) {
    params.set("modestbranding", "1");
  }

  if (options.rel === false) {
    params.set("rel", "0");
  }

  // Disable video annotations
  params.set("iv_load_policy", "3");

  const queryString = params.toString();
  return `https://www.youtube-nocookie.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`;
}

