import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { canonicalUrl, PUBLIC_ROUTES, SITE_ORIGIN } from '../seo.config.mjs'

const outputRoot = new URL('../dist/', import.meta.url)
const projectRoot = new URL('../../', import.meta.url)
const [robots, sitemap, vercelConfig] = await Promise.all([
  readFile(new URL('robots.txt', outputRoot), 'utf8'),
  readFile(new URL('sitemap.xml', outputRoot), 'utf8'),
  readFile(new URL('vercel.json', projectRoot), 'utf8').then(JSON.parse),
])
await access(new URL('favicon.svg', outputRoot))

const pages = new Map()
for (const route of PUBLIC_ROUTES) {
  const relativePath = route.path === '/' ? 'index.html' : `${route.path.replace(/^\/+|\/+$/g, '')}/index.html`
  const html = await readFile(new URL(relativePath, outputRoot), 'utf8')
  pages.set(route.path, html)

  assert.match(html, /<div id="root"><a class="skip-link"/, `${route.path} has prerendered content`)
  assert.doesNotMatch(html, /__SOORU_[A-Z_]+__/)
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route.path} has exactly one H1`)
  assert.match(html, new RegExp(`<title>${route.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`))
  assert.match(html, new RegExp(`<meta name="description" content="${route.description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`))
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalUrl(route.path).replaceAll('.', '\\.')}"`))
  assert.match(html, new RegExp(`<meta property="og:url" content="${canonicalUrl(route.path).replaceAll('.', '\\.')}"`))
  assert.match(html, new RegExp(`<meta property="og:image" content="${route.image.replaceAll('.', '\\.')}"`))
  assert.match(html, /<meta property="og:title"/)
  assert.match(html, /<meta property="og:description"/)
  assert.match(html, /<meta name="twitter:image"/)
  assert.doesNotMatch(html, /https:\/\/(?:www\.)?thesooru\.com/)
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, `${route.path} is not noindexed`)

  const structuredData = html.match(/<script id="sooru-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
  assert.ok(structuredData, `${route.path} has JSON-LD in initial HTML`)
  const jsonLd = JSON.parse(structuredData)
  assert.ok(Array.isArray(jsonLd['@graph']))
  const businessNodes = jsonLd['@graph'].filter((node) => Array.isArray(node['@type']) && node['@type'].includes('LodgingBusiness'))
  assert.equal(businessNodes.length, 1, `${route.path} references one shared lodging entity`)
  const business = businessNodes[0]
  const website = jsonLd['@graph'].find((node) => node['@type'] === 'WebSite')
  const webpage = jsonLd['@graph'].find((node) => node['@type'] === 'WebPage')
  const breadcrumb = jsonLd['@graph'].find((node) => node['@type'] === 'BreadcrumbList')
  const imageObject = jsonLd['@graph'].find((node) => node['@type'] === 'ImageObject')
  assert.equal(business.name, 'The Sooru Experience')
  assert.equal(business.alternateName, 'Entire Villa: Malnad Courtyard (Sooru Experience)')
  assert.equal(business.url, canonicalUrl('/'))
  assert.equal(business.description, 'An accommodation experience in Mudigere, Chikkamagaluru, Karnataka, featuring rooms, mountain views and a home-like atmosphere.')
  assert.equal(business.sameAs.includes('https://www.airbnb.co.uk/rooms/1483328101335591480'), true)
  assert.equal(business.address.addressLocality, 'Mudigere')
  assert.equal(business.address.addressRegion, 'Karnataka')
  assert.equal(business.address.addressCountry, 'IN')
  assert.equal(business.containedInPlace.name, 'Chikkamagaluru district')
  assert.equal('telephone' in business, false)
  assert.equal('geo' in business, false)
  assert.equal(website.publisher['@id'], business['@id'])
  assert.equal(webpage.url, canonicalUrl(route.path))
  assert.equal(webpage.breadcrumb['@id'], breadcrumb['@id'])
  assert.equal(webpage.primaryImageOfPage['@id'], imageObject['@id'])
  assert.equal(imageObject.url, route.image)
}

assert.equal(new Set([...pages.values()].map((html) => html.match(/<title>(.*?)<\/title>/)?.[1])).size, PUBLIC_ROUTES.length, 'Every page has a unique title')
assert.equal(new Set([...pages.values()].map((html) => html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1])).size, PUBLIC_ROUTES.length, 'Every page has a unique H1')
assert.equal(new Set([...pages.values()].map((html) => html.match(/<meta name="description" content="([^"]+)/)?.[1])).size, PUBLIC_ROUTES.length, 'Every page has a unique description')

for (const [routePath, html] of pages) {
  for (const target of PUBLIC_ROUTES) {
    if (routePath === target.path) continue
    assert.ok(html.includes(`href="${target.path}"`), `${routePath} links to ${target.path}`)
  }
  assert.ok(html.includes('https://www.airbnb.co.uk/rooms/1483328101335591480'), `${routePath} includes the official booking link`)
  const bookingLinks = [...html.matchAll(/<a\b(?=[^>]*href="https:\/\/www\.airbnb\.co\.uk\/rooms\/1483328101335591480")([^>]*)>/g)]
  assert.ok(bookingLinks.length > 0, `${routePath} renders booking links`)
  assert.ok(bookingLinks.every(([, attrs]) => /target="_blank"/.test(attrs) && /rel="noopener noreferrer"/.test(attrs)), `${routePath} booking links use safe external attributes`)
}

const home = pages.get('/')
const sourceContent = await readFile(new URL('../src/data/siteContent.ts', import.meta.url), 'utf8')
const extraPhotosSection = sourceContent.slice(sourceContent.indexOf('export const additionalPropertyPhotographs = ['))
const photoDefinitions = [...extraPhotosSection.matchAll(/alt: '([^']+)'/g)].slice(0, 27)
assert.equal(photoDefinitions.length, 27)
for (const [, alt] of photoDefinitions) {
  const slug = alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '')
  const variantPath = new URL(`../public/images/responsive/${slug}-480.jpeg`, import.meta.url)
  await access(variantPath)
  assert.ok(home.includes(`/images/responsive/${slug}-480.jpeg 480w`), `Responsive image source exists for ${slug}`)
}
assert.equal((home.match(/class="more-photos__item"/g) ?? []).length, 27)
assert.ok((home.match(/class="property-gallery__item[\s\S]*?alt="[^"]+"/g) ?? []).length > 0)
assert.ok((pages.get('/gallery/').match(/class="more-photos__item"/g) ?? []).length === 27, 'Gallery page includes the existing photo collection')

const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
assert.deepEqual(sitemapUrls, PUBLIC_ROUTES.map((route) => canonicalUrl(route.path)))
assert.match(robots, new RegExp(`Sitemap: ${SITE_ORIGIN.replaceAll('.', '\\.')}\/sitemap\\.xml`))
assert.match(home, /Experience a Peaceful Homestay in Mudigere at The Sooru Experience/)

const redirects = vercelConfig.redirects ?? []
for (const host of ['thesooru\\.com', 'www\\.thesooru\\.com', 'thesooruexperience\\.com']) {
  const rule = redirects.find((candidate) => candidate.has?.some((condition) => condition.type === 'host' && condition.value === host))
  assert.ok(rule, `A permanent canonical redirect exists for ${host}`)
  assert.equal(rule.source, '/:path*')
  assert.equal(rule.destination, `${SITE_ORIGIN}/:path*`)
  assert.equal(rule.permanent, true)
}
assert.ok(vercelConfig.headers.some((entry) => entry.headers.some((header) => header.key === 'Strict-Transport-Security')))

console.log(JSON.stringify({
  prerenderedRoutes: [...pages.keys()],
  uniquePageTitlesAndH1s: pages.size,
  canonicalAndSocialMetadata: 'verified per route',
  sitemapUrls,
  structuredData: 'valid LodgingBusiness JSON-LD on each route',
  organizationWebsitePageBreadcrumbImageGraph: 'verified per route',
  responsiveGalleryPhotos: 27,
  permanentHostRedirects: redirects.length,
}, null, 2))
