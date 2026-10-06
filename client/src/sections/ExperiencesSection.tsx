import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { photographs } from '../data/siteContent'
import { PropertyImage } from '../components/PropertyImage'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const ExperienceScene = lazy(() => import('./experience/ExperienceScene'))
type SceneQuality = 'high' | 'medium' | 'low'

const regionalNotes = [
  { number: '01', title: 'COFFEE', detail: 'Coffee-growing landscapes are part of the wider Chikkamagaluru region.' },
  { number: '02', title: 'GREEN', detail: 'Layered greenery and mountain scenery shape the Malnad landscape.' },
  { number: '03', title: 'STILLNESS', detail: 'A gentle pace and the first light make room for a quieter start.' },
  { number: '04', title: 'MALNAD', detail: 'Timber, terracotta, and a traditional courtyard bring the region into the home.' },
]

function getSceneQuality(): SceneQuality {
  const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const compact = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches
  const tablet = window.matchMedia('(max-width: 1100px)').matches
  if (device.connection?.saveData || (device.hardwareConcurrency > 0 && device.hardwareConcurrency <= 2) || (device.deviceMemory !== undefined && device.deviceMemory <= 2)) return 'low'
  if (compact) return 'low'
  return tablet ? 'medium' : 'high'
}

function canRenderWebGL(): boolean {
  const device = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
  if ((device.hardwareConcurrency ?? 8) <= 2 || (device.deviceMemory ?? 8) <= 2) return false
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

export function ExperiencesSection() {
  const section = useRef<HTMLElement>(null)
  const journey = useRef<HTMLDivElement>(null)
  const motionState = useRef({ progress: 0 })
  const reducedMotion = useReducedMotionPreference()
  const [quality] = useState(getSceneQuality)
  const [loadScene, setLoadScene] = useState(false)

  useEffect(() => {
    const element = journey.current
    if (!element || reducedMotion) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      if (canRenderWebGL()) setLoadScene(true)
      observer.disconnect()
    }, { rootMargin: '400px 0px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [reducedMotion])

  useGSAP(() => {
    const stage = journey.current
    if (!stage || reducedMotion) return
    const chapters = gsap.utils.toArray<HTMLElement>('.experience__chapter', stage)
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'top top',
        end: window.matchMedia('(max-width: 760px), (pointer: coarse)').matches ? '+=150%' : '+=230%',
        pin: stage,
        scrub: .85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    timeline.to(motionState.current, { progress: 1, duration: 1, ease: 'none' }, 0)
    chapters.forEach((chapter, index) => {
      const start = [.025, .27, .515, .76][index]
      timeline.fromTo(chapter, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: .12, ease: 'none' }, start)
      if (index < chapters.length - 1) timeline.to(chapter, { autoAlpha: 0, y: -28, duration: .1, ease: 'none' }, start + .18)
    })
  }, { scope: section, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section className={`experiences${reducedMotion ? ' experiences--reduced' : ''}`} id="experiences" aria-labelledby="experiences-title" ref={section}>
      <div className="experiences__heading">
        <div><p className="eyebrow">The landscape around Sooru</p><h2 id="experiences-title">A slower rhythm<br />of <em>Malnad.</em></h2></div>
        <p>In the Chikkamagaluru and Mudigere region, the landscape moves through coffee country, green hills, and distant mountain lines.</p>
      </div>

      <div className="experience__journey" ref={journey}>
        <div className="experience__fallback" aria-hidden="true">
          <PropertyImage src={photographs.exterior} alt="" width={1024} height={1024} loading="lazy" decoding="async" />
        </div>
        {!reducedMotion && loadScene && <Suspense fallback={null}><ExperienceScene motionState={motionState} quality={quality} /></Suspense>}
        <div className="experience__veil" aria-hidden="true" />
        <div className="experience__topline"><span>CHIKKAMAGALURU · KARNATAKA</span><span>THE LANDSCAPE AROUND SOORU</span></div>
        <div className={`experience__chapters${reducedMotion ? ' experience__chapters--static' : ''}`}>
          {regionalNotes.map((note) => (
            <article className="experience__chapter" key={note.number}>
              <span className="experience__chapter-number">{note.number} / 04</span>
              <h3>{note.title}</h3>
              <p>{note.detail}</p>
            </article>
          ))}
        </div>
        <p className="experience__scroll-hint" aria-hidden="true">SCROLL TO WANDER <span /></p>
      </div>
    </section>
  )
}
