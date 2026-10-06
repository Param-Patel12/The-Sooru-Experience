import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bedroomPhotographs } from '../data/siteContent'
import { PhotoLightbox } from '../components/PhotoLightbox'
import { PropertyImage } from '../components/PropertyImage'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'

gsap.registerPlugin(ScrollTrigger)

export function AccommodationSection() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const currentIndex = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const reducedMotion = useReducedMotionPreference()
  const activePhoto = bedroomPhotographs[activeIndex]

  const updateActiveIndex = useCallback(() => {
    const frame = viewport.current
    if (!frame) return
    const center = frame.getBoundingClientRect().left + frame.clientWidth / 2
    let nearest = currentIndex.current
    let distance = Number.POSITIVE_INFINITY
    cards.current.forEach((card, index) => {
      if (!card) return
      const bounds = card.getBoundingClientRect()
      const offset = Math.abs(bounds.left + bounds.width / 2 - center)
      const nextDistance = offset
      if (nextDistance < distance) { nearest = index; distance = nextDistance }
      if (window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches) {
        const focus = gsap.utils.clamp(0, 1, 1 - offset / (frame.clientWidth * .88))
        gsap.set(card, { scale: .87 + focus * .13, opacity: .6 + focus * .4, zIndex: Math.round(1 + focus * 4), '--shadow-level': .08 + focus * .2 })
      }
    })
    if (nearest !== currentIndex.current) {
      currentIndex.current = nearest
      setActiveIndex(nearest)
    }
  }, [])

  const navigateTo = useCallback((index: number) => {
    const next = (index + bedroomPhotographs.length) % bedroomPhotographs.length
    currentIndex.current = next
    setActiveIndex(next)
    const card = cards.current[next]
    const frame = viewport.current
    if (!card || !frame) return

    if (!reducedMotion && window.matchMedia('(min-width: 901px)').matches) {
      const trigger = ScrollTrigger.getAll().find((item) => item.trigger === section.current)
      const strip = track.current
      if (!trigger || !strip) return
      const maxDistance = Math.max(1, strip.scrollWidth - frame.clientWidth)
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const progress = gsap.utils.clamp(0, 1, (cardCenter - frame.clientWidth / 2) / maxDistance)
      trigger.scroll(trigger.start + (trigger.end - trigger.start) * progress)
    } else {
      card.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [reducedMotion])

  useGSAP(() => {
    const root = section.current
    const strip = track.current
    const frame = viewport.current
    if (!root || !strip || !frame || reducedMotion) return

    const media = gsap.matchMedia()
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, strip.scrollWidth - frame.clientWidth)
      gsap.to(strip, {
        x: () => -distance(),
        ease: 'none',
        onUpdate: updateActiveIndex,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: root,
          scrub: .85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    })
    return () => media.revert()
  }, { scope: section, dependencies: [reducedMotion, updateActiveIndex], revertOnUpdate: true })

  useEffect(() => {
    const root = section.current
    if (!root || reducedMotion || !window.matchMedia('(min-width: 901px) and (pointer: fine)').matches) return
    const movers = cards.current.flatMap((card) => {
      const image = card?.querySelector<HTMLElement>('.accommodation-card__photo')
      if (!card || !image) return []
      return [{
        card, image,
        rotateX: gsap.quickTo(card, 'rotationX', { duration: .8, ease: 'power3.out' }),
        rotateY: gsap.quickTo(card, 'rotationY', { duration: .8, ease: 'power3.out' }),
        imageX: gsap.quickTo(image, 'x', { duration: .9, ease: 'power3.out' }),
        imageY: gsap.quickTo(image, 'y', { duration: .9, ease: 'power3.out' }),
        shadow: gsap.quickTo(card, '--shadow-level', { duration: .8, ease: 'power3.out' }),
      }]
    })

    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      const px = gsap.utils.clamp(-1, 1, ((event.clientX - bounds.left) / bounds.width - .5) * 2)
      const py = gsap.utils.clamp(-1, 1, ((event.clientY - bounds.top) / bounds.height - .5) * 2)
      movers.forEach(({ card, rotateX, rotateY, imageX, imageY, shadow }) => {
        const rect = card.getBoundingClientRect()
        const focus = gsap.utils.clamp(0, 1, 1 - Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) / (window.innerWidth * .68))
        const depthDrift = .45 + (1 - focus) * .75
        rotateX(-py * 1.1 * focus)
        rotateY(px * 1.35 * focus)
        imageX(px * 9 * depthDrift)
        imageY(py * 7 * depthDrift)
        shadow(.1 + focus * .18)
      })
    }
    const reset = () => movers.forEach(({ rotateX, rotateY, imageX, imageY, shadow }) => {
      rotateX(0); rotateY(0); imageX(0); imageY(0); shadow(.1)
    })

    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', reset, { passive: true })
    return () => {
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', reset)
      movers.forEach(({ card, image }) => gsap.killTweensOf([card, image]))
    }
  }, [reducedMotion])

  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigateTo(currentIndex.current - 1) }
    if (event.key === 'ArrowRight') { event.preventDefault(); navigateTo(currentIndex.current + 1) }
  }

  return (
    <section className={`accommodation${reducedMotion ? ' accommodation--reduced' : ''}`} id="accommodation" aria-labelledby="accommodation-title" ref={section}>
      <div className="accommodation__heading">
        <div><p className="eyebrow">A place to rest <span className="section-number">03 — 04</span></p><h2 id="accommodation-title">Rooms with<br /><em>room to breathe.</em></h2></div>
        <div className="accommodation__intro">
          <p>A selection of bedroom photographs, capturing soft daylight, timber furniture, and the quiet details of the home.</p>
          <div className="accommodation-gallery__controls" role="group" aria-label="Bedroom photograph navigation">
            <button className="gallery-arrow" type="button" aria-label="Previous bedroom photograph" onClick={() => navigateTo(currentIndex.current - 1)}><ArrowLeft size={17} aria-hidden="true" /></button>
            <button className="gallery-arrow" type="button" aria-label="Next bedroom photograph" onClick={() => navigateTo(currentIndex.current + 1)}><ArrowRight size={17} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div className="accommodation-gallery" role="region" aria-roledescription="carousel" aria-label="Bedroom photographs" tabIndex={0} onKeyDown={handleGalleryKeyDown}>
        <div className="accommodation-gallery__viewport" ref={viewport} onScroll={updateActiveIndex}>
          <div className="accommodation-gallery__track" ref={track}>
            {bedroomPhotographs.map((photo, index) => (
              <article className="accommodation-card" key={photo.image} ref={(node) => { cards.current[index] = node }}>
                <button className="accommodation-card__button" type="button" aria-label={`View photograph ${index + 1} of ${bedroomPhotographs.length}: ${photo.alt}`} onClick={() => { currentIndex.current = index; setActiveIndex(index); setLightboxOpen(true) }}>
                  <PropertyImage className="accommodation-card__photo" src={photo.image} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
                  <span className="accommodation-card__shade" aria-hidden="true" />
                  <span className="accommodation-card__caption"><span className="accommodation-card__index">{String(index + 1).padStart(2, '0')}</span><span>{photo.caption}</span></span>
                </button>
              </article>
            ))}
          </div>
        </div>
        <p className="visually-hidden" aria-live="polite" aria-atomic="true">Photograph {activeIndex + 1} of {bedroomPhotographs.length}: {activePhoto.caption}</p>
      </div>

      <p className="accommodation__hint" aria-hidden="true"><span className="accommodation__hint-desktop">Scroll to explore</span><span className="accommodation__hint-mobile">Swipe to explore</span><span>—</span> {String(activeIndex + 1).padStart(2, '0')} / {String(bedroomPhotographs.length).padStart(2, '0')}</p>

      <PhotoLightbox photos={bedroomPhotographs} activeIndex={activeIndex} onActiveIndexChange={(index) => { currentIndex.current = index; setActiveIndex(index) }} open={lightboxOpen} onClose={() => setLightboxOpen(false)} label="Enlarged bedroom photograph" />
    </section>
  )
}
