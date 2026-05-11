/**
 * Optimized social share utilities.
 * Uses proper share APIs for Zalo and Facebook with OG metadata support.
 */

export interface ShareParams {
  url: string
  title: string
  description?: string
  image?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://marshell.vn'

function getFullUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

function getEncodedUrl(url: string): string {
  return encodeURIComponent(getFullUrl(url))
}

/** Facebook Dialog share — opens a native share dialog */
export function shareFacebook(params: ShareParams): void {
  if (typeof window === 'undefined') return
  const { url } = params
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${getEncodedUrl(url)}&quote=${getEncodedUrl(params.title)}`
  window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500')
}

/** Zalo share — opens Zalo share dialog */
export function shareZalo(params: ShareParams): void {
  if (typeof window === 'undefined') return
  const { url } = params
  const shareUrl = `https://zalo.me/share?url=${getEncodedUrl(url)}`
  window.open(shareUrl, '_blank', 'noopener,noreferrer')
}

/** Copy current page URL to clipboard with fallback */
export async function copyLink(url: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false
  try {
    await navigator.clipboard.writeText(getFullUrl(url))
    return true
  } catch {
    return false
  }
}

/** Get the current page URL (client-side) */
export function getCurrentUrl(): string {
  if (typeof window === 'undefined') return BASE_URL
  return window.location.href
}
