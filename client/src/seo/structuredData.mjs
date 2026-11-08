import {
  AIRBNB_BOOKING_URL,
  BUSINESS_DESCRIPTION,
  BUSINESS_IMAGE,
  BUSINESS_NAME,
  SITE_ORIGIN,
  canonicalUrl,
} from '../../seo.config.mjs'

const businessId = `${SITE_ORIGIN}/#business`
const websiteId = `${SITE_ORIGIN}/#website`

/** One canonical LodgingBusiness entity also represents the brand Organization. */
export function createBusinessEntity({ image = BUSINESS_IMAGE } = {}) {
  return {
    '@type': ['LodgingBusiness', 'Organization'],
    '@id': businessId,
    name: BUSINESS_NAME,
    alternateName: 'Entire Villa: Malnad Courtyard (Sooru Experience)',
    url: `${SITE_ORIGIN}/`,
    description: BUSINESS_DESCRIPTION,
    image: [image],
    sameAs: [
      'https://www.instagram.com/thesooruexperience/',
      AIRBNB_BOOKING_URL,
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mudigere',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Chikkamagaluru district',
    },
  }
}

export function createBreadcrumbSchema(route) {
  const items = [{ name: 'Home', path: '/' }]
  if (route.path !== '/') items.push({ name: route.breadcrumb || route.navLabel || route.title.split('|')[0].trim(), path: route.path })

  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl(route.path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  }
}

export function createPageStructuredData(route) {
  const pageUrl = canonicalUrl(route.path)
  const imageId = `${pageUrl}#primaryimage`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const business = createBusinessEntity({ image: route.image })

  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${SITE_ORIGIN}/`,
        name: BUSINESS_NAME,
        publisher: { '@id': businessId },
        inLanguage: 'en',
      },
      {
        '@type': 'ImageObject',
        '@id': imageId,
        url: route.image,
        contentUrl: route.image,
        caption: route.imageAlt,
        width: route.imageWidth,
        height: route.imageHeight,
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: route.title,
        description: route.description,
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        mainEntity: { '@id': businessId },
        primaryImageOfPage: { '@id': imageId },
        breadcrumb: { '@id': breadcrumbId },
        inLanguage: 'en',
      },
      createBreadcrumbSchema(route),
    ],
  }
}

/** Build BlogPosting only from a real published article's verified data. */
export function createArticleSchema({
  url,
  headline,
  description,
  image,
  datePublished,
  dateModified = datePublished,
  authorName,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline,
    description,
    image: [image],
    datePublished,
    dateModified,
    author: { '@type': 'Organization', name: authorName || BUSINESS_NAME },
    publisher: { '@id': businessId },
  }
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}
