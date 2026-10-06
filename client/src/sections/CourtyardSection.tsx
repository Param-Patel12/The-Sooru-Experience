import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { photographs } from '../data/siteContent'
import { PropertyImage } from '../components/PropertyImage'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'

gsap.registerPlugin(ScrollTrigger)

export function CourtyardSection() {
  const section = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotionPreference()

  useGSAP(() => {
    const root = section.current
    if (!root) return

    const select = gsap.utils.selector(root)
    const frame = select('.courtyard__frame')[0]

    if (reducedMotion) {
      gsap.fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 1, duration: .45, ease: 'power1.out' })
      return
    }

    const media = gsap.matchMedia()
    const buildReveal = (isMobile: boolean) => {
      const stage = select('.courtyard__stage')[0]
      const title = select('.courtyard__title')[0]
      const copy = select('.courtyard__copy')[0]
      const eyebrow = select('.courtyard__eyebrow')[0]
      const index = select('.courtyard__index')[0]
      const scrim = select('.courtyard__scrim')[0]
      const dust = select('.courtyard__dust')[0]
      const caption = select('.courtyard__caption')[0]
      const getStartWidth = () => Math.min(window.innerWidth * (isMobile ? .78 : .44), window.innerHeight * (isMobile ? .37 : .44))

      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          pin: stage,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (isMobile ? 1 : 1.55))}`,
          scrub: isMobile ? .55 : .85,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
        .fromTo(stage, { backgroundColor: '#F4EDE0' }, { backgroundColor: '#49372F', duration: 1, ease: 'none' }, 0)
        .fromTo(frame,
          {
            width: getStartWidth,
            height: () => getStartWidth() * 1280 / 853,
            xPercent: -50,
            yPercent: -50,
            rotationX: isMobile ? 0 : 2.4,
            rotationY: isMobile ? 0 : -1.2,
            transformPerspective: 1400,
          },
          {
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            xPercent: -50,
            yPercent: -50,
            rotationX: 0,
            rotationY: 0,
            backgroundColor: 'transparent',
            duration: 1,
            ease: 'none',
          },
          0,
        )
        .fromTo(scrim, { opacity: 0 }, { opacity: .42, duration: .72, ease: 'none' }, .25)
        .fromTo(title, { x: isMobile ? -12 : -48, y: isMobile ? 16 : 34, color: '#24382D' }, { x: 0, y: 0, color: '#F4EDE0', duration: .68, ease: 'none' }, .13)
        .fromTo(copy, { autoAlpha: 0, y: isMobile ? 14 : 25 }, { autoAlpha: 1, y: 0, duration: .42, ease: 'none' }, isMobile ? .48 : .56)
        .fromTo(eyebrow, { color: '#596557' }, { color: '#E1D6C5', duration: .45, ease: 'none' }, .08)
        .fromTo(index, { yPercent: 12, color: '#B89968' }, { yPercent: -14, color: '#E6D9C3', duration: 1, ease: 'none' }, 0)
        .fromTo(dust, { autoAlpha: 0, yPercent: 8 }, { autoAlpha: .62, yPercent: -8, duration: 1, ease: 'none' }, .2)
        .fromTo(caption, { autoAlpha: 0 }, { autoAlpha: 1, duration: .3, ease: 'none' }, .68)
    }

    media.add('(max-width: 680px)', () => buildReveal(true))
    media.add('(min-width: 681px)', () => buildReveal(false))

    return () => media.revert()
  }, { scope: section, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section className={`courtyard${reducedMotion ? ' courtyard--reduced' : ''}`} id="courtyard" aria-labelledby="courtyard-title" ref={section}>
      <div className="courtyard__stage">
        <div className="courtyard__topline">
          <p className="courtyard__eyebrow">AT THE HEART OF THE HOME</p>
          <span className="courtyard__counter">02 — 04</span>
        </div>

        <span className="courtyard__index" aria-hidden="true">02</span>

        <figure className="courtyard__frame">
          <PropertyImage src={photographs.courtyard} alt="The traditional inner courtyard, with terracotta floors, timber beams and a suspended wooden swing" width={853} height={1280} loading="lazy" decoding="async" />
          <span className="courtyard__scrim" aria-hidden="true" />
          <span className="courtyard__dust" aria-hidden="true" />
          <figcaption className="courtyard__caption"><span>The courtyard at Sooru</span><span>Timber · terracotta · daylight</span></figcaption>
        </figure>

        <div className="courtyard__story">
          <h2 className="courtyard__title" id="courtyard-title">THE HEART<br />OF SOORU</h2>
          <div className="courtyard__copy">
            <p className="courtyard__lead">Life gathers around the open centre.</p>
            <p>The open courtyard is a defining feature of traditional Malnad homes, letting daylight and air find their way through the house. Here, warm interiors, natural timber, and terracotta meet around the wooden swing.</p>
            <p>A place to sit for a while, listen, and let the afternoon slow down.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
