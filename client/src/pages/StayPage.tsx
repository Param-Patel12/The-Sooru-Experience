import { ArrowUpRight } from 'lucide-react'
import { ContentPageLayout } from '../components/ContentPageLayout'
import { PageHero } from '../components/PageHero'
import { photographs } from '../data/siteContent'
import { BookingButton } from '../components/BookingButton'
import { AccommodationSection } from '../sections/AccommodationSection'

export function StayPage() {
  return (
    <ContentPageLayout currentPath="/stay/" className="editorial-page--stay">
      <PageHero
        eyebrow="The Sooru Experience — Mudigere"
        title="A Homely Stay with Mountain Views"
        introduction="Find rooms, a home-like atmosphere, and a peaceful place to rest in nature in Mudigere, Chikkamagaluru."
        image={photographs.seating}
        imageAlt="Wooden seating in a warm interior with terracotta flooring"
        imageWidth={960}
        imageHeight={1280}
        action={{ label: 'Check Availability', location: 'stay.hero' }}
      />
      <section className="editorial-section editorial-section--intro">
        <p className="eyebrow">A place to settle in</p>
        <h2>Rooms for a slower stay.</h2>
        <p>The Sooru Experience is a homestay in Mudigere, Chikkamagaluru, Karnataka. Explore the bedroom photographs, take in the mountain views, and find a home-like setting for time spent resting in nature.</p>
        <a className="text-link" href="/experiences/">Explore the surroundings <ArrowUpRight size={15} aria-hidden="true" /></a>
      </section>
      <AccommodationSection />
      <section className="editorial-booking-band">
        <div><p className="eyebrow">Plan your stay</p><h2>See current room details and availability on Airbnb.</h2></div>
        <BookingButton label="View on Airbnb" location="stay.booking-band" variant="light" />
      </section>
    </ContentPageLayout>
  )
}
