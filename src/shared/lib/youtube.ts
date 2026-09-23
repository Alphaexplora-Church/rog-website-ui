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
