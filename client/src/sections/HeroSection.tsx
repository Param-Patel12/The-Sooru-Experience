import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { bookingUrl, photographs } from '../data/siteContent'
import { PropertyImage } from '../components/PropertyImage'
import { useReducedMotionPreference } from '../hooks/useReducedMotionPreference'
import type { HeroMotionState, SceneQuality } from './HeroCamera'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = lazy(() => import('./HeroScene'))

function getSceneQuality(): SceneQuality {
  const device = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
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

function AtmosphereFallback() {
  return <div className="hero__atmosphere-fallback" aria-hidden="true" />
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const motionState = useRef<HeroMotionState>({ progress: 0, pointerX: 0, pointerY: 0 })
  const reducedMotion = useReducedMotionPreference()
  const [quality] = useState(getSceneQuality)
  const [loadScene, setLoadScene] = useState(false)
  const [webglSupported, setWebglSupported] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    let timerHandle = 0
    let cancelled = false
    const image = heroRef.current?.querySelector<HTMLImageElement>('.hero__photo')

    const scheduleScene = () => {
      const start = () => {
        if (!cancelled) {
          setWebglSupported(canRenderWebGL())
          setLoadScene(true)
        }
      }
      timerHandle = window.setTimeout(start, 850)
    }

    if (image?.complete) scheduleScene()
    else image?.addEventListener('load', scheduleScene, { once: true })

    return () => {
      cancelled = true
      if (timerHandle) window.clearTimeout(timerHandle)
      image?.removeEventListener('load', scheduleScene)
    }
  }, [reducedMotion])

  useGSAP(() => {
    if (reducedMotion) return

    const hero = heroRef.current
    if (!hero) return
    const select = gsap.utils.selector(hero)
    const photo = select('.hero__photo')[0]
    const photoLayer = select('.hero__photo-layer')[0]
    const atmosphere = select('.hero__atmosphere')[0]
    const eyebrow = select('.hero__eyebrow')
    const words = select('.hero__word')
    const supporting = select('.hero__support, .hero__location, .hero__actions')
    const scrollCue = select('.hero__scroll')

    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (eyebrow.length) entrance.fromTo(eyebrow, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: .75 }, .12)
    if (words.length) entrance.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.05, stagger: .12 }, .2)
    if (supporting.length) entrance.fromTo(supporting, { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .7, stagger: .11 }, .63)
    if (scrollCue.length) entrance.fromTo(scrollCue, { autoAlpha: 0 }, { autoAlpha: 1, duration: .65 }, 1.25)
    if (photo) entrance.fromTo(photo, { scale: 1.1 }, { scale: 1.035, duration: 2.2, ease: 'power2.out' }, 0)

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })
    scrollTimeline.to(motionState.current, { progress: 1, duration: 1, ease: 'none' }, 0)
    const title = select('#hero-title')
    if (title.length) scrollTimeline.to(title, { autoAlpha: 0, y: -24, duration: .46, ease: 'none' }, .2)
    if (photoLayer) scrollTimeline.to(photoLayer, { scale: 1.025, duration: .42, ease: 'none' }, .58)
    if (atmosphere) scrollTimeline.to(atmosphere, { opacity: 0.58, duration: .2, ease: 'none' }, .82)
  }, { scope: heroRef, dependencies: [reducedMotion], revertOnUpdate: true })

  useEffect(() => {
    const hero = heroRef.current
    const image = hero?.querySelector<HTMLElement>('.hero__photo')
    if (!hero || !image || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return

    const moveX = gsap.quickTo(image, 'x', { duration: 1.1, ease: 'power3.out' })
    const moveY = gsap.quickTo(image, 'y', { duration: 1.1, ease: 'power3.out' })
    const onPointerMove = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect()
      motionState.current.pointerX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2))
      motionState.current.pointerY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2))
      moveX(motionState.current.pointerX * -4.5)
      moveY(motionState.current.pointerY * -3)
    }
    const onPointerLeave = () => {
      motionState.current.pointerX = 0
      motionState.current.pointerY = 0
      moveX(0)
      moveY(0)
    }
    hero.addEventListener('pointermove', onPointerMove, { passive: true })
    hero.addEventListener('pointerleave', onPointerLeave, { passive: true })

    return () => {
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      gsap.killTweensOf(image)
    }
  }, [reducedMotion])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
      <div className="hero__photo-layer">
        <PropertyImage className="hero__photo" src={photographs.exterior} alt="The Sooru Experience beneath a warm Malnad sunset" width={1024} height={1024} fetchPriority="high" decoding="async" />
      </div>
      <div className="hero__shade" aria-hidden="true" />
      {reducedMotion || !loadScene || !webglSupported ? <AtmosphereFallback /> : (
        <Suspense fallback={<AtmosphereFallback />}>
          <HeroScene motionState={motionState} quality={quality} />
        </Suspense>
      )}
      <div className="hero__content">
        <p className="eyebrow hero__eyebrow"><span /> A traditional home in the green hills of Malnad</p>
        <h1 id="hero-title" aria-label="The Sooru Experience">
          <span className="hero__line"><span className="hero__word">THE</span> <span className="hero__word">SOORU</span></span>
          <span className="hero__line"><span className="hero__word">EXPERIENCE</span></span>
        </h1>
        <p className="hero__support">Where the hills feel like home.</p>
        <p className="hero__location">CHIKKAMAGALURU <span>·</span> KARNATAKA</p>
        <div className="hero__actions">
          <a className="button button--light" href="#story">Explore Sooru <ArrowDown size={15} aria-hidden="true" /></a>
          <a className="button button--outline" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book on Airbnb <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
      <a className="hero__scroll" href="#story" aria-label="Scroll to discover The Sooru Experience">
        <span className="hero__scroll-line" />
        <span>Scroll to discover</span>
        <ArrowDown size={13} aria-hidden="true" />
      </a>
    </section>
  )
}
