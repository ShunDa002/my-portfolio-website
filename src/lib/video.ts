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

/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * (e.g., youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>)
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
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  // Regex matching standard YouTube patterns:
  // - youtu.be/<id>
  // - youtube.com/watch?v=<id>
  // - youtube.com/embed/<id>
  // - youtube.com/v/<id>
  // YouTube video IDs are typically 11 characters (alphanumeric, -, _)
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  if (match && match[1]) {
    const videoId = match[1];
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

  return null;
}
