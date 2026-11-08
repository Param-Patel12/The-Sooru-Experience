import test from 'node:test'
import assert from 'node:assert/strict'
import { AIRBNB_BOOKING_URL, BUSINESS_NAME, PUBLIC_ROUTES, SITE_ORIGIN, canonicalUrl } from '../../seo.config.mjs'
import {
  createArticleSchema,
  createPageStructuredData,
  serializeJsonLd,
} from '../../src/seo/structuredData.mjs'
import {
  initializeGA4,
  isValidMeasurementId,
  resetPageViewForTesting,
  trackAirbnbBookingClick,
  trackGalleryImageView,
  trackNavigationClick,
  trackPageView,
} from '../../src/analytics/ga4.mjs'

test('GA4 measurement IDs are validated and missing IDs keep integration disabled', () => {
  assert.equal(isValidMeasurementId('G-ABC1234567'), true)
  assert.equal(isValidMeasurementId(''), false)
  assert.equal(isValidMeasurementId('G-PLACEHOLDER'), false)
  assert.equal(initializeGA4({ measurementId: '' , targetWindow: {}, targetDocument: {} }), false)
})

test('GA4 initializes once without automatic page views', () => {
  const calls = []
  const head = { appendChild: (script) => calls.push(['script', script]) }
  const document = {
    head,
    getElementById: () => calls.some(([kind]) => kind === 'script') ? {} : null,
    createElement: () => ({ setAttribute() {} }),
  }
  const targetWindow = { dataLayer: [] }
  assert.equal(initializeGA4({ measurementId: 'G-ABC1234567', targetWindow, targetDocument: document }), true)
  assert.equal(initializeGA4({ measurementId: 'G-ABC1234567', targetWindow, targetDocument: document }), true)
  const queued = targetWindow.dataLayer.map((entry) => Array.from(entry))
  assert.equal(calls.filter(([kind]) => kind === 'script').length, 1)
  assert.equal(queued.filter(([command]) => command === 'config').length, 1)
  assert.deepEqual(queued.find(([command]) => command === 'config')[2], { send_page_view: false })
})

test('GA4 page and intent events use non-personal, bounded parameters and deduplicate page views', () => {
  const events = []
  const originalWindow = globalThis.window
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { gtag: (...args) => events.push(args), location: { pathname: '/stay/' } },
  })
  try {
    resetPageViewForTesting()
    assert.equal(trackPageView('/stay/'), true)
    assert.equal(trackPageView('/stay/'), false)
    trackAirbnbBookingClick({ pagePath: '/stay/', buttonLocation: 'stay.hero' })
    trackNavigationClick({ pagePath: '/', targetPath: '/stay/', linkLabel: 'The stay' })
    trackGalleryImageView({ pagePath: '/gallery/', imageUrl: '/images/interiors/Sooru7.jpeg' })
    assert.deepEqual(events.map(([command, name]) => [command, name]), [
      ['event', 'page_view'],
      ['event', 'airbnb_booking_click'],
      ['event', 'navigation_click'],
      ['event', 'gallery_image_view'],
    ])
    const bookingParams = events[1][2]
    assert.deepEqual(bookingParams, {
      page_path: '/stay/',
      button_location: 'stay.hero',
      destination_domain: 'airbnb.co.uk',
      booking_platform: 'Airbnb',
    })
    assert.equal(events[0][2].page_location, canonicalUrl('/stay/'))
    assert.ok(!Object.keys(bookingParams).some((key) => /email|phone|name|guest|message/i.test(key)))
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow })
    resetPageViewForTesting()
  }
})

test('each public route has one connected business entity and page-specific graph metadata', () => {
  const entityIds = new Set()
  for (const route of PUBLIC_ROUTES) {
    const graph = createPageStructuredData(route)
    const parsed = JSON.parse(serializeJsonLd(graph))
    const business = parsed['@graph'].find((item) => item['@type'].includes('LodgingBusiness'))
    const website = parsed['@graph'].find((item) => item['@type'] === 'WebSite')
    const webpage = parsed['@graph'].find((item) => item['@type'] === 'WebPage')
    const image = parsed['@graph'].find((item) => item['@type'] === 'ImageObject')
    const breadcrumb = parsed['@graph'].find((item) => item['@type'] === 'BreadcrumbList')
    assert.equal(parsed['@graph'].filter((item) => item['@type'].includes('LodgingBusiness')).length, 1)
    assert.equal(business.name, BUSINESS_NAME)
    assert.equal(business.url, `${SITE_ORIGIN}/`)
    assert.equal(business.sameAs.includes(AIRBNB_BOOKING_URL), true)
    assert.equal(business.address.addressLocality, 'Mudigere')
    assert.equal('telephone' in business, false)
    assert.equal('geo' in business, false)
    assert.equal(website.publisher['@id'], business['@id'])
    assert.equal(webpage.url, canonicalUrl(route.path))
    assert.equal(webpage.primaryImageOfPage['@id'], image['@id'])
    assert.equal(webpage.breadcrumb['@id'], breadcrumb['@id'])
    assert.equal(image.url, route.image)
    assert.ok(breadcrumb.itemListElement.length >= 1)
    entityIds.add(business['@id'])
  }
  assert.equal(entityIds.size, 1, 'all pages point to the same business entity')
})

test('BlogPosting utility accepts genuine article fields without emitting fictional content', () => {
  const article = createArticleSchema({
    url: `${SITE_ORIGIN}/journal/example/`,
    headline: 'Verified editorial headline',
    description: 'Verified editorial summary.',
    image: `${SITE_ORIGIN}/images/exterior/sooru-exterior.webp`,
    datePublished: '2026-10-31',
    authorName: BUSINESS_NAME,
  })
  assert.equal(article['@type'], 'BlogPosting')
  assert.equal(article.dateModified, article.datePublished)
  assert.equal(article.headline, 'Verified editorial headline')
})
