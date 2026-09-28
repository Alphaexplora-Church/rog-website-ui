/**
 * YouTube helpers — River of God's actual sermon video source is YouTube
 * (@RIVEROFGODORTIGAS), confirmed by Jude ("lahat ng mga videos na nanjan
 * is ang link talaga niyan ay sa youtube"). Rather than storing a separate
 * thumbnail URL per sermon, every sermon just stores its YouTube video id
 * and these two helpers derive the thumbnail and the embed URL from it —
 * "automatic" per Jude's instruction, so a thumbnail can never drift out
 * of sync with its video.
 */
export function youtubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

/**
 * The 11-character id out of any link an editor might paste. Same patterns
 * rog-cms's Sermon lifecycle uses — the CMS stores the parsed id itself, so
 * this is the fallback for an entry saved before that existed.
 */
export function youtubeIdFromUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?(?:.*&)?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}
