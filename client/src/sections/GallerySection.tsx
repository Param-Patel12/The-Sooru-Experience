import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { propertyPhotographs } from '../data/siteContent'
import { PhotoLightbox } from '../components/PhotoLightbox'
import { PropertyImage } from '../components/PropertyImage'

gsap.registerPlugin(ScrollTrigger)

const scatteredPoses = [
  { x: -70, y: 58, rotation: -6, scale: 0.9 },
  { x: 75, y: -58, rotation: 7, scale: 0.82 },
  { x: -48, y: -72, rotation: 4, scale: 0.94 },
  { x: 92, y: 52, rotation: -5, scale: 0.86 },
  { x: -86, y: 30, rotation: 5, scale: 0.8 },
  { x: 60, y: -82, rotation: -7, scale: 0.92 },
  { x: -55, y: 82, rotation: 3, scale: 0.84 },
  { x: 84, y: -20, rotation: -4, scale: 0.88 },
]

export function GallerySection() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const sectionElement = section.current
    const stageElement = stage.current
    if (!sectionElement || !stageElement) return

    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>('.property-gallery__item')
        const captions = gsap.utils.toArray<HTMLElement>('.property-gallery__caption')
        const backgroundType = sectionElement.querySelector<HTMLElement>('.property-gallery__backdrop-type')
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageElement,
            start: 'top top',
            end: '+=165%',
            scrub: 1.15,
            pin: stageElement,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        timeline.fromTo(cards, {
          x: (index) => scatteredPoses[index % scatteredPoses.length].x,
          y: (index) => scatteredPoses[index % scatteredPoses.length].y,
          rotation: (index) => scatteredPoses[index % scatteredPoses.length].rotation,
          scale: (index) => scatteredPoses[index % scatteredPoses.length].scale,
          autoAlpha: 0.82,
        }, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.035,
          ease: 'power2.out',
        }, 0)
        timeline.fromTo(captions, { y: 12, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.18,
          stagger: 0.025,
          ease: 'power1.out',
        }, 0.48)
        if (backgroundType) {
          timeline.fromTo(backgroundType, { yPercent: 8 }, { yPercent: -8, ease: 'none', duration: 1 }, 0)
        }
        return () => timeline.scrollTrigger?.kill()
      })

    }, sectionElement)

    return () => {
      media.revert()
      context.revert()
    }
  }, [])

  useEffect(() => {
    const sectionElement = section.current
    if (!sectionElement || !window.matchMedia('(max-width: 899px)').matches) return

    const reveal = () => sectionElement.classList.add('property-gallery--mobile-revealed')
    if (!('IntersectionObserver' in window)) {
      reveal()
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      reveal()
      observer.disconnect()
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    observer.observe(sectionElement)

    return () => observer.disconnect()
  }, [])

  return (
    <section className="property-gallery section-pad" id="gallery" aria-labelledby="gallery-title" ref={section}>
      <div className="property-gallery__heading">
        <div><p className="eyebrow">A closer look around</p><h2 id="gallery-title">The <em>Sooru</em> album.</h2></div>
        <p>Eight glimpses of the home, from its courtyard to the details of a slower day.</p>
      </div>

      <div className="property-gallery__stage" ref={stage}>
        <span className="property-gallery__backdrop-type" aria-hidden="true">SOORU</span>
        <div className="property-gallery__grid" role="group" aria-label="Photographs of The Sooru Experience">
        {propertyPhotographs.map((photo, index) => (
          <button
            className={`property-gallery__item property-gallery__item--${index + 1}`}
            key={photo.image}
            type="button"
            aria-label={`Open photograph ${index + 1} of ${propertyPhotographs.length}: ${photo.caption}`}
            onClick={() => { setActiveIndex(index); setLightboxOpen(true) }}
          >
            <PropertyImage src={photo.image} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
            <span className="property-gallery__caption"><span>{photo.caption}</span><span>{String(index + 1).padStart(2, '0')}</span></span>
          </button>
        ))}
        </div>
      </div>

      <PhotoLightbox
        photos={propertyPhotographs}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        label="The Sooru Experience photo gallery"
      />
    </section>
  )
}
