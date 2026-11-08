export const bookingUrl = 'https://www.airbnb.co.uk/rooms/1483328101335591480'
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

const additionalPhotoFiles = [
  'Sooru 1.jpeg', 'Sooru 2.jpeg', 'Sooru 3.jpeg', 'Sooru 4.jpeg',
  'Sooru 5.jpeg', 'Sooru 6.jpeg', 'Sooru 7.jpeg',
  'sooru 8.jpeg', 'sooru 9.jpeg', 'Sooru 10.jpeg', 'Sooru 11.jpeg', 'Sooru 12.jpeg',
  'Sooru 13.jpeg', 'Sooru 14.jpeg', 'Sooru 15.jpeg', 'Sooru 16.jpeg',
  'Sooru 17.jpeg', 'Sooru 18.jpeg', 'Sooru 19.jpeg', 'Sooru 20.jpeg',
  'Sooru 21.jpeg', 'Sooru 22.jpeg', 'Soory 22.jpeg', 'Sooru 23.jpeg',
  'Sooru 24.jpeg', 'Sooru 25.jpeg', 'Sooru 26.jpeg',
]

export const additionalPropertyPhotographs = additionalPhotoFiles.map((file, index) => ({
  image: `/images/${encodeURIComponent(file)}`,
  alt: `A view of The Sooru Experience, photograph ${index + 1}`,
  caption: `A closer look at Sooru - ${String(index + 1).padStart(2, '0')}`,
  width: 1024,
  height: 1280,
  webp: false,
}))
