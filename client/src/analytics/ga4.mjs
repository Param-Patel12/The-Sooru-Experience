import { canonicalUrl } from '../../seo.config.mjs'

const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{10}$/
let lastPagePath = null

export function isValidMeasurementId(value) {
  return typeof value === 'string' && MEASUREMENT_ID_PATTERN.test(value.trim())
}

export function initializeGA4({
  measurementId,
  targetWindow = typeof window === 'undefined' ? undefined : window,
  targetDocument = typeof document === 'undefined' ? undefined : document,
}) {
  const id = typeof measurementId === 'string' ? measurementId.trim() : ''
  if (!isValidMeasurementId(id) || !targetWindow || !targetDocument) return false

  targetWindow.dataLayer = targetWindow.dataLayer || []
  targetWindow.gtag = targetWindow.gtag || function gtag() {
    targetWindow.dataLayer.push(arguments)
  }

  if (!targetDocument.getElementById('sooru-ga4-script')) {
    const script = targetDocument.createElement('script')
    script.id = 'sooru-ga4-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    targetDocument.head.appendChild(script)
  }

  if (targetWindow.__sooruGA4Configured !== id) {
    targetWindow.gtag('js', new Date())
    targetWindow.gtag('config', id, { send_page_view: false })
    targetWindow.__sooruGA4Configured = id
  }
  return true
}

function sendEvent(name, parameters) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false
  window.gtag('event', name, parameters)
  return true
}

function currentPath(fallback = '/') {
  return typeof window === 'undefined' ? fallback : `${window.location.pathname}`
}

export function trackPageView(pagePath = currentPath()) {
  if (!pagePath || pagePath === lastPagePath) return false
  const sent = sendEvent('page_view', {
    page_path: pagePath,
    page_location: canonicalUrl(pagePath),
    page_title: typeof document === 'undefined' ? undefined : document.title,
  })
  if (sent) lastPagePath = pagePath
  return sent
}

export function trackAirbnbBookingClick({ pagePath = currentPath(), buttonLocation }) {
  return sendEvent('airbnb_booking_click', {
    page_path: pagePath,
    button_location: buttonLocation,
    destination_domain: 'airbnb.co.uk',
    booking_platform: 'Airbnb',
  })
}

export function trackNavigationClick({ pagePath = currentPath(), targetPath, linkLabel }) {
  return sendEvent('navigation_click', {
    page_path: pagePath,
    target_path: targetPath,
    link_label: linkLabel,
  })
}

export function trackGalleryImageView({ pagePath = currentPath(), imageUrl }) {
  return sendEvent('gallery_image_view', {
    page_path: pagePath,
    image_url: imageUrl,
  })
}

export function trackContactClick({ pagePath = currentPath(), contactMethod }) {
  return sendEvent('contact_click', {
    page_path: pagePath,
    contact_method: contactMethod,
  })
}

export function resetPageViewForTesting() {
  lastPagePath = null
}

