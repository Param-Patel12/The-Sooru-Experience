import { useEffect, useRef, useState } from 'react'
import { PhotoLightbox } from '../components/PhotoLightbox'
import { PropertyImage } from '../components/PropertyImage'
import { additionalPropertyPhotographs } from '../data/siteContent'

export function MorePhotosSection() {
  const section = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    const element = section.current
    if (!element) return
    const cards = element.querySelectorAll<HTMLElement>('.more-photos__item')
    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="more-photos section-pad" aria-labelledby="more-photos-title" ref={section}>
      <div className="more-photos__heading">
        <div>
          <p className="eyebrow">A little more to explore</p>
          <h2 id="more-photos-title">The details of <em>Sooru.</em></h2>
        </div>
        <p>Take your time and wander through more corners of the homestay.</p>
      </div>
      <div className="more-photos__grid" role="group" aria-label="More photographs of The Sooru Experience">
        {additionalPropertyPhotographs.map((photo, index) => (
          <button
            className="more-photos__item"
            key={photo.image}
            type="button"
            aria-label={`Open photograph ${index + 1} of ${additionalPropertyPhotographs.length}: ${photo.caption}`}
            onClick={() => { setActiveIndex(index); setLightboxOpen(true) }}
          >
            <PropertyImage src={photo.image} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" webp={false} responsiveSrcSet={photo.responsiveSrcSet} sizes={photo.sizes} />
            <span className="more-photos__caption">{photo.caption}</span>
          </button>
        ))}
      </div>
      <PhotoLightbox
        photos={additionalPropertyPhotographs}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        label="More photographs of The Sooru Experience"
      />
    </section>
  )
}
