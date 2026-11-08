export function isValidMeasurementId(value?: string): boolean
export function initializeGA4(options: {
  measurementId?: string
  targetWindow?: Window & {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __sooruGA4Configured?: string
  }
  targetDocument?: Document
}): boolean
export function trackPageView(pagePath?: string): boolean
export function trackAirbnbBookingClick(options: { pagePath?: string; buttonLocation: string }): boolean
export function trackNavigationClick(options: { pagePath?: string; targetPath: string; linkLabel: string }): boolean
export function trackGalleryImageView(options: { pagePath?: string; imageUrl: string }): boolean
export function trackContactClick(options: { pagePath?: string; contactMethod: string }): boolean
export function resetPageViewForTesting(): void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __sooruGA4Configured?: string
  }
}
