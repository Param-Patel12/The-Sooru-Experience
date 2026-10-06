import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotionPreference } from './useReducedMotionPreference'

gsap.registerPlugin(ScrollTrigger)

export function useScrollReveal<T extends HTMLElement>() {
  const scope = useRef<T>(null)
  const reducedMotion = useReducedMotionPreference()

  useGSAP(() => {
    if (reducedMotion || !scope.current) return

    gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current).forEach((element) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: .8,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        },
      )
    })
  }, { scope, dependencies: [reducedMotion], revertOnUpdate: true })

  return scope
}
