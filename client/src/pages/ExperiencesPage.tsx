import { ArrowUpRight } from 'lucide-react'
import { ContentPageLayout } from '../components/ContentPageLayout'
import { EditorialPhotoGrid } from '../components/EditorialPhotoGrid'
import { PageHero } from '../components/PageHero'
import { additionalPropertyPhotographs, photographs, propertyPhotographs } from '../data/siteContent'

export function ExperiencesPage() {
  return (
    <ContentPageLayout currentPath="/experiences/" className="editorial-page--experiences">
      <PageHero
        eyebrow="A homely stay — Mudigere"
        title="Rest in Nature at The Sooru Experience"
        introduction="Mountain views, peaceful surroundings, and a comfortable, home-like atmosphere make room to slow down."
        image={photographs.exterior}
        imageAlt="The red-tiled Sooru home among green hills at sunset"
        imageWidth={1024}
        imageHeight={1024}
        action={{ label: 'Book Your Stay', location: 'experiences.hero' }}
      />
      <section className="editorial-section editorial-section--intro">
        <p className="eyebrow">A quieter pace</p>
        <h2>Let the surroundings set the rhythm.</h2>
        <p>The Sooru Experience is a place to enjoy mountain views, find comfort in a home-like stay, and take time to rest in nature in Mudigere, Chikkamagaluru.</p>
      </section>
      <section className="editorial-section">
        <div className="editorial-section__heading">
          <div><p className="eyebrow">The view</p><h2>Mountain views in Mudigere.</h2></div>
          <p>Look out across the hills and green surroundings in photographs of the property and its setting.</p>
        </div>
        <EditorialPhotoGrid
          label="Mountain-view photographs at The Sooru Experience"
          photos={[propertyPhotographs[0], additionalPropertyPhotographs[18], additionalPropertyPhotographs[21]]}
        />
      </section>
      <section className="editorial-link-band">
        <div><p className="eyebrow">Make time to unwind</p><h2>A homely stay, with space to rest.</h2></div>
        <div className="editorial-link-band__actions">
          <a className="button button--forest" href="/stay/">Explore the rooms <ArrowUpRight size={15} aria-hidden="true" /></a>
          <a className="text-link" href="/gallery/">View the photo gallery <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </section>
    </ContentPageLayout>
  )
}
