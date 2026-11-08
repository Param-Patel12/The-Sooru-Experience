import { bookingUrl } from './siteContent'

export const faqItems = [
  {
    question: 'Where is The Sooru Experience located?',
    answer: 'The Sooru Experience is in Mudigere, Chikkamagaluru district, Karnataka, India.',
  },
  {
    question: 'What is the stay like?',
    answer: 'It offers rooms, mountain views, peaceful surroundings, and a home-like atmosphere for guests looking to rest in nature.',
  },
  {
    question: 'Where can I see the rooms?',
    answer: 'Browse the bedroom photographs on the Stay page. The Airbnb listing has the current room details for booking.',
    link: { href: '/stay/', label: 'Explore the Stay' },
  },
  {
    question: 'How do I check availability and book?',
    answer: 'Check current availability and make a booking through the official Airbnb listing.',
    link: { href: bookingUrl, label: 'View The Sooru Experience on Airbnb', external: true },
  },
  {
    question: 'Where can I get the exact arrival details?',
    answer: 'The public website identifies the location as Mudigere, but does not publish a street address or map pin. Contact the host through Airbnb for current arrival guidance.',
    link: { href: bookingUrl, label: 'Contact the host on Airbnb', external: true },
  },
]
