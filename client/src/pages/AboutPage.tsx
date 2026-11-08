import { ArrowUpRight } from 'lucide-react'
import { ContentPageLayout } from '../components/ContentPageLayout'
import { EditorialPhotoGrid } from '../components/EditorialPhotoGrid'
import { PageHero } from '../components/PageHero'
import { additionalPropertyPhotographs, photographs } from '../data/siteContent'
import { BookingButton } from '../components/BookingButton'

export function AboutPage() {
  return (
    <ContentPageLayout currentPath="/about/" className="editorial-page--about">
      <PageHero
        eyebrow="The Sooru Experience — Mudigere"
        title="A Homely Stay in the Hills of Mudigere"
        introduction="The Sooru Experience brings together rooms, mountain views, and a peaceful setting for a chance to rest in nature."
        image={photographs.courtyard}
        imageAlt="The traditional inner courtyard with a wooden swing and terracotta floors"
        imageWidth={853}
        imageHeight={1280}
        action={{ label: 'View on Airbnb', location: 'about.hero' }}
      />
      <section className="editorial-section editorial-section--intro">
        <p className="eyebrow">About the stay</p>
        <h2>Made for feeling at home.</h2>
        <p>The Sooru Experience is a homestay in Mudigere, Chikkamagaluru, Karnataka. Its identity is simple: a comfortable, home-like stay, beautiful mountain views, peaceful surroundings, and time to rest in nature.</p>
        <p>This page shares the verified details available about the stay. Current booking information is provided through Airbnb.</p>
        <BookingButton label="View on Airbnb" location="about.introduction" variant="link" className="text-link" />
      </section>
      <section className="editorial-section">
        <div className="editorial-section__heading">
          <div><p className="eyebrow">A place in Mudigere</p><h2>Rooms, views, and quiet surroundings.</h2></div>
          <p>Photographs offer a closer look at the home and its setting.</p>
        </div>
        <EditorialPhotoGrid
          label="Photographs of The Sooru Experience"
          photos={[{ image: photographs.exterior, alt: 'The red-tiled Sooru home among green hills at sunset', width: 1024, height: 1024 }, additionalPropertyPhotographs[18], additionalPropertyPhotographs[24]]}
        />
      </section>
      <section className="editorial-link-band">
        <div><p className="eyebrow">Continue exploring</p><h2>Find your way around The Sooru Experience.</h2></div>
        <div className="editorial-link-band__actions">
          <a className="button button--forest" href="/stay/">Explore the rooms <ArrowUpRight size={15} aria-hidden="true" /></a>
          <a className="text-link" href="/location/">View location information <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </section>
    </ContentPageLayout>
  )
}
