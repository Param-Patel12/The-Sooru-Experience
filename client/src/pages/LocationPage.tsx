import { ContentPageLayout } from '../components/ContentPageLayout'
import { EditorialPhotoGrid } from '../components/EditorialPhotoGrid'
import { PageHero } from '../components/PageHero'
import { additionalPropertyPhotographs, photographs } from '../data/siteContent'
import { BookingButton } from '../components/BookingButton'

export function LocationPage() {
  return (
    <ContentPageLayout currentPath="/location/" className="editorial-page--location">
      <PageHero
        eyebrow="Mudigere — Chikkamagaluru — Karnataka"
        title="Find The Sooru Experience in Mudigere"
        introduction="The homestay is located in Mudigere, Chikkamagaluru, Karnataka, India, among peaceful natural surroundings and mountain views."
        image={photographs.exterior}
        imageAlt="The red-tiled Sooru home among green hills at sunset"
        imageWidth={1024}
        imageHeight={1024}
        action={{ label: 'View on Airbnb', location: 'location.hero' }}
      />
      <section className="editorial-section editorial-section--location-copy">
        <div>
          <p className="eyebrow">The property location</p>
          <h2>Mudigere, Karnataka.</h2>
        </div>
        <div className="editorial-section__copy">
          <p>The Sooru Experience is in Mudigere, Chikkamagaluru district, Karnataka. The public website does not publish a street address or map pin, so this page does not include a map or estimated distances.</p>
          <p>For the current arrival details, use the official Airbnb listing and contact the host there before travelling.</p>
          <BookingButton className="text-link" label="View on Airbnb" location="location.details" variant="link" />
        </div>
      </section>
      <section className="editorial-section editorial-section--arrival">
        <p className="eyebrow">Arrival planning</p>
        <h2>Check the road conditions before setting out.</h2>
        <p>The Airbnb listing currently advises that the approach road can be narrow and muddy. It recommends that small cars and sedans travel carefully, that guests avoid arriving in rain or after dark, and that they contact the host for local updates. Confirm current conditions with the host before your trip.</p>
        <BookingButton className="text-link" label="View on Airbnb" location="location.arrival-guidance" variant="link" />
      </section>
      <section className="editorial-section">
        <p className="eyebrow">The setting</p>
        <h2>Views across the surrounding hills.</h2>
        <EditorialPhotoGrid
          label="Photographs of the Mudigere surroundings"
          photos={[additionalPropertyPhotographs[18], additionalPropertyPhotographs[21], additionalPropertyPhotographs[22]]}
        />
      </section>
    </ContentPageLayout>
  )
}
