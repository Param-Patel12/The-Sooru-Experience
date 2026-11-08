import { ArrowUpRight } from 'lucide-react'
import { ContentPageLayout } from '../components/ContentPageLayout'
import { PageHero } from '../components/PageHero'
import { photographs } from '../data/siteContent'
import { GallerySection } from '../sections/GallerySection'
import { MorePhotosSection } from '../sections/MorePhotosSection'

export function GalleryPage() {
  return (
    <ContentPageLayout currentPath="/gallery/" className="editorial-page--gallery">
      <PageHero
        eyebrow="A closer look around"
        title="Photographs of The Sooru Experience"
        introduction="Explore the rooms, the home, and views across the peaceful surroundings in Mudigere."
        image={photographs.exterior}
        imageAlt="The red-tiled Sooru home among green hills at sunset"
        imageWidth={1024}
        imageHeight={1024}
        action={{ label: 'View on Airbnb', location: 'gallery.hero' }}
      />
      <GallerySection />
      <MorePhotosSection />
      <section className="editorial-link-band">
        <div><p className="eyebrow">See the rooms</p><h2>Explore the stay in more detail.</h2></div>
        <a className="button button--forest" href="/stay/">View the rooms <ArrowUpRight size={15} aria-hidden="true" /></a>
      </section>
    </ContentPageLayout>
  )
}
