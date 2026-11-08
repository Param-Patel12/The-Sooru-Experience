import { AIRBNB_BOOKING_URL } from '../../seo.config.mjs'

export const bookingUrl = AIRBNB_BOOKING_URL
export const instagramUrl = 'https://www.instagram.com/thesooruexperience/'

export const photographs = {
  exterior: '/images/exterior/sooru-exterior.jpeg',
  courtyard: '/images/courtyard/Sooru2.jpeg',
  dining: '/images/interiors/Sooru7.jpeg',
  seating: '/images/interiors/Sooru8.jpeg',
}

export const bedroomPhotographs = [
  {
    image: '/images/bedrooms/Sooru3.jpeg',
    alt: 'Wooden bed with white bedding beside a curtained window and terracotta floor',
    caption: 'Window light, timber and terracotta',
    width: 853,
    height: 1280,
  },
  {
    image: '/images/bedrooms/Sooru4.jpeg',
    alt: 'A wooden bed with white linen in a bright bedroom',
    caption: 'A softer start to the day',
    width: 853,
    height: 1280,
  },
  {
    image: '/images/bedrooms/Sooru5.jpeg',
    alt: 'White bedding and a wooden bed beside a garden-facing window',
    caption: 'A quiet corner in the green',
    width: 853,
    height: 1280,
  },
  {
    image: '/images/bedrooms/Sooru6.jpeg',
    alt: 'Close view of white bedding, a patterned runner and a wooden bed',
    caption: 'The details of a restful room',
    width: 959,
    height: 1280,
  },
]

export const propertyPhotographs = [
  {
    image: photographs.exterior,
    alt: 'The red-tiled Sooru home among green hills at sunset',
    caption: 'The home in its green setting',
    width: 1024,
    height: 1024,
  },
  {
    image: photographs.courtyard,
    alt: 'The traditional inner courtyard with a wooden swing and terracotta floors',
    caption: 'The courtyard at the heart of the home',
    width: 853,
    height: 1280,
  },
  ...bedroomPhotographs,
  {
    image: photographs.seating,
    alt: 'Wooden seating in a warm interior with terracotta flooring',
    caption: 'A warm place to settle in',
    width: 960,
    height: 1280,
  },
  {
    image: photographs.dining,
    alt: 'A wooden dining table beside bright windows',
    caption: 'Light across the dining room',
    width: 959,
    height: 1280,
  },
]

export const additionalPropertyPhotographs = [
  { file: 'Sooru 1.jpeg', alt: 'A tree silhouetted against the evening sky above the estate', caption: 'Evening light over the estate', width: 960, height: 1280 },
  { file: 'Sooru 2.jpeg', alt: 'A small covered pavilion among trees at sunset', caption: 'The garden pavilion at dusk', width: 960, height: 1280 },
  { file: 'Sooru 3.jpeg', alt: 'Sun setting behind the homestay garden and trees', caption: 'Sunset beyond the garden', width: 960, height: 1280 },
  { file: 'Sooru 4.jpeg', alt: 'A garden shelter beneath a warm evening sky', caption: 'The shelter in the evening', width: 1280, height: 960 },
  { file: 'Sooru 5.jpeg', alt: 'Green hills and forest beneath a cloudy sky', caption: 'Clouds gathering over the hills', width: 1280, height: 960 },
  { file: 'Sooru 6.jpeg', alt: 'A path beside the homestay garden at sunset', caption: 'A quiet path at sundown', width: 960, height: 1280 },
  { file: 'Sooru 7.jpeg', alt: 'A wooden bed with white bedding in a bright bedroom', caption: 'A bright bedroom', width: 960, height: 1280 },
  { file: 'sooru 8.jpeg', alt: 'The homestay beside a green lawn and surrounding trees', caption: 'The home beside the lawn', width: 960, height: 1280 },
  { file: 'sooru 9.jpeg', alt: 'Palm trees rising above the green estate landscape', caption: 'Palms across the estate', width: 960, height: 1280 },
  { file: 'Sooru 10.jpeg', alt: 'A covered garden pavilion beneath the setting sun', caption: 'The pavilion at sunset', width: 1280, height: 960 },
  { file: 'Sooru 11.jpeg', alt: 'An interior view through a timber doorway at the homestay', caption: 'A view through the home', width: 960, height: 1280 },
  { file: 'Sooru 12.jpeg', alt: 'A covered veranda with terracotta flooring and garden views', caption: 'The covered veranda', width: 960, height: 1280 },
  { file: 'Sooru 13.jpeg', alt: 'A forested hill rising above the estate greenery', caption: 'Forest on the hillside', width: 960, height: 1280 },
  { file: 'Sooru 14.jpeg', alt: 'A wide view across the green hills of the region', caption: 'Across the green hills', width: 1280, height: 960 },
  { file: 'Sooru 15.jpeg', alt: 'The homestay exterior and paved courtyard in daylight', caption: 'The courtyard in daylight', width: 960, height: 1280 },
  { file: 'Sooru 16.jpeg', alt: 'A bedroom with a wooden bed beside a curtained window', caption: 'Window light in the bedroom', width: 853, height: 1280 },
  { file: 'Sooru 17.jpeg', alt: 'Layered green hills beneath a bright clouded sky', caption: 'Layered hills and clouds', width: 960, height: 1280 },
  { file: 'Sooru 18.jpeg', alt: 'An elevated view of the red-tiled homestay among trees', caption: 'The home among the trees', width: 960, height: 1280 },
  { file: 'Sooru 19.jpeg', alt: 'Mist drifting across forested hills in the distance', caption: 'Mist over the hills', width: 960, height: 1280 },
  { file: 'Sooru 20.jpeg', alt: 'The estate driveway and garden in the evening light', caption: 'The estate in the evening', width: 960, height: 1280 },
  { file: 'Sooru 21.jpeg', alt: 'Green leaves and small fruit on a plant at the estate', caption: 'A detail from the estate greenery', width: 960, height: 1280 },
  { file: 'Sooru 22.jpeg', alt: 'A misty mountain ridge viewed above the estate', caption: 'A ridge beyond the estate', width: 1280, height: 960 },
  { file: 'Soory 22.jpeg', alt: 'The sun setting over distant green hills', caption: 'Sunset across the hills', width: 1280, height: 670 },
  { file: 'Sooru 23.jpeg', alt: 'Tall palms among the green estate trees', caption: 'Palms in the estate', width: 960, height: 1280 },
  { file: 'Sooru 24.jpeg', alt: 'A bedroom doorway framed by indoor plants', caption: 'A leafy doorway', width: 960, height: 1280 },
  { file: 'Sooru 25.jpeg', alt: 'A wooden bed dressed in white linen and a patterned runner', caption: 'White linen and timber', width: 960, height: 1280 },
  { file: 'Sooru 26.jpeg', alt: 'A leafy garden tree beside the red-tiled veranda', caption: 'Greenery beside the veranda', width: 960, height: 1280 },
].map(({ file, ...photo }) => ({
  image: `/images/${encodeURIComponent(file)}`,
  ...photo,
  webp: false,
  responsiveSrcSet: `/images/responsive/${photo.alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/g, '')}-480.jpeg 480w, /images/${encodeURIComponent(file)} ${photo.width}w`,
  sizes: '(max-width: 900px) 46vw, 24vw',
}))
