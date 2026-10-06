import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'
import { SiteMicroInteractions } from '../components/SiteMicroInteractions'
import { EnquirySection } from '../sections/EnquirySection'
import { AccommodationSection } from '../sections/AccommodationSection'
import { CourtyardSection } from '../sections/CourtyardSection'
import { GallerySection } from '../sections/GallerySection'
import { HeroSection } from '../sections/HeroSection'
import { InteriorsSection } from '../sections/InteriorsSection'
import { LocationSection } from '../sections/LocationSection'
import { StorySection } from '../sections/StorySection'
import './site.css'

export default function SitePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <StorySection />
        <CourtyardSection />
        <AccommodationSection />
        <InteriorsSection />
        <GallerySection />
        <LocationSection />
        <EnquirySection />
      </main>
      <SiteFooter />
      <SiteMicroInteractions />
    </>
  )
}
