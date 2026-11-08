export const SITE_ORIGIN = 'https://www.thesooruexperience.com'
export const BUSINESS_NAME = 'The Sooru Experience'
export const AIRBNB_BOOKING_URL = 'https://www.airbnb.co.uk/rooms/1483328101335591480'
export const BUSINESS_DESCRIPTION = 'An accommodation experience in Mudigere, Chikkamagaluru, Karnataka, featuring rooms, mountain views and a home-like atmosphere.'
export const BUSINESS_IMAGE = `${SITE_ORIGIN}/images/exterior/sooru-exterior.webp`

export const SITE_DESCRIPTION = 'A homely stay with beautiful mountain views in Mudigere, Chikkamagaluru. Discover The Sooru Experience and book your stay on Airbnb.'

export const SITE_TITLE = 'The Sooru Experience | Homestay in Mudigere, Chikkamagaluru'

export const SITE_OG_IMAGE = `${SITE_ORIGIN}/images/exterior/sooru-exterior.webp`

export const PUBLIC_ROUTES = [
  {
    id: 'home',
    path: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    image: SITE_OG_IMAGE,
    imageAlt: 'The red-tiled Sooru home among green hills at sunset',
    imageWidth: 1024,
    imageHeight: 1024,
  },
  {
    id: 'stay',
    path: '/stay/',
    title: 'The Stay | Rooms and Mountain Views in Mudigere',
    description: 'Explore the bedroom photographs and learn about a homely stay with mountain views at The Sooru Experience in Mudigere, Karnataka.',
    image: `${SITE_ORIGIN}/images/bedrooms/Sooru3.webp`,
    imageAlt: 'Wooden bed with white bedding beside a curtained window and terracotta floor',
    imageWidth: 853,
    imageHeight: 1280,
  },
  {
    id: 'location',
    path: '/location/',
    title: 'Location | The Sooru Experience in Mudigere, Karnataka',
    description: 'Find The Sooru Experience in Mudigere, Chikkamagaluru, Karnataka. Read the available arrival guidance and check the Airbnb listing.',
    image: SITE_OG_IMAGE,
  },
  {
    id: 'experiences',
    path: '/experiences/',
    title: 'Rest in Nature | The Sooru Experience, Mudigere',
    description: 'Discover the peaceful surroundings, mountain views, and home-like atmosphere at The Sooru Experience in Mudigere.',
    image: SITE_OG_IMAGE,
  },
  {
    id: 'gallery',
    path: '/gallery/',
    title: 'Photo Gallery | The Sooru Experience in Mudigere',
    description: 'View photographs of the rooms, home, and mountain surroundings at The Sooru Experience in Mudigere, Chikkamagaluru.',
    image: SITE_OG_IMAGE,
  },
  {
    id: 'faq',
    path: '/faq/',
    title: 'Guest FAQs | The Sooru Experience, Mudigere',
    description: 'Answers about the location, rooms, and Airbnb booking for The Sooru Experience in Mudigere, Karnataka.',
    image: SITE_OG_IMAGE,
  },
  {
    id: 'about',
    path: '/about/',
    title: 'About | The Sooru Experience Homestay in Mudigere',
    description: 'Learn about The Sooru Experience: a homely stay with mountain views and peaceful surroundings in Mudigere, Karnataka.',
    image: SITE_OG_IMAGE,
  },
].map((route) => ({
  ...route,
  imageAlt: route.imageAlt || 'The red-tiled Sooru home among green hills at sunset',
  imageWidth: route.imageWidth || 1024,
  imageHeight: route.imageHeight || 1024,
}))

export function canonicalUrl(path) {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`
  return `${SITE_ORIGIN}${normalizedPath}`
}
