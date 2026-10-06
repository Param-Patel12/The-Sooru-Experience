import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { photographs } from '../data/siteContent'
import { PropertyImage } from '../components/PropertyImage'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const titleLines = [
  ['WHERE', 'THE', 'HILLS'],
  ['FEEL', 'LIKE', 'HOME.'],
]

export function StorySection() {
  const section = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotionPreference()

  useGSAP(() => {
    const root = section.current
    if (reducedMotion || !root) return

    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const words = gsap.utils.toArray<HTMLElement>('[data-story-word]', root)
    const titleLines = gsap.utils.toArray<HTMLElement>('.story__title-line', root)
    const photo = root.querySelector<HTMLElement>('.story__photo-layer')
    const rule = root.querySelector<HTMLElement>('.story__title-rule')
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top 76%',
        end: 'center 38%',
        scrub: 0.75,
        invalidateOnRefresh: true,
      },
    })

    timeline.fromTo(words,
      {
        yPercent: (index) => isMobile
          ? (index % 3 === 1 ? 104 : 78)
          : (index % 3 === 1 ? 122 : 92),
        color: '#5d685d',
      },
      {
        yPercent: 0,
        color: '#24382d',
        stagger: isMobile ? 0.075 : 0.105,
        duration: isMobile ? 0.38 : 0.46,
        ease: 'none',
      },
      0,
    )

    if (titleLines[0]) timeline.to(titleLines[0], { yPercent: isMobile ? -2 : -4, duration: 1, ease: 'none' }, 0)
    if (titleLines[1]) timeline.to(titleLines[1], { yPercent: isMobile ? -4 : -8, duration: 1, ease: 'none' }, 0)
    if (rule) timeline.fromTo(rule, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.42, ease: 'none' }, 0.34)
    if (photo) timeline.fromTo(photo, { yPercent: isMobile ? -2 : -4 }, { yPercent: isMobile ? 2 : 5, duration: 1, ease: 'none' }, 0)
  }, { scope: section, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section className="story section-pad" id="story" aria-labelledby="story-title" ref={section}>
      <div className="story__photo-layer" aria-hidden="true">
        <PropertyImage className="story__photo" src={photographs.courtyard} alt="" width={853} height={1280} loading="lazy" decoding="async" />
      </div>
      <div className="story__image-veil" aria-hidden="true" />
      <div className="story__topline"><span className="eyebrow">A place to arrive</span><span className="section-number">01 — 04</span></div>
      <div className="story__layout">
        <div className="story__title-wrap">
          <h2 className="story__title" id="story-title">
            {titleLines.map((line, lineIndex) => (
              <span className="story__title-line" key={lineIndex}>
                {line.map((word, wordIndex) => (
                  <span className="story__word" data-story-word key={word}>
                    {word}{wordIndex < line.length - 1 ? '\u00a0' : ''}
                  </span>
                ))}
              </span>
            ))}
          </h2>
          <span className="story__title-rule" aria-hidden="true" />
        </div>
        <div className="story__copy">
          <p className="story__lead">A peaceful Malnad homestay, surrounded by the green hills and quiet landscapes of Chikkamagaluru.</p>
          <p>The Sooru Experience is a traditional courtyard home shaped by natural timber, warm interiors, and the changing light of the countryside. Here, the day has room to unfold at its own pace.</p>
        </div>
      </div>
      <span className="story__depth-mark" aria-hidden="true"><span /> MALNAD · KARNATAKA</span>
    </section>
  )
}
