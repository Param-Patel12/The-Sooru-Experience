import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const headingSelector = [
  '.accommodation__heading h2',
  '.experiences__heading h2',
  '.property-gallery__heading h2',
  '.enquiry__intro h2',
].join(',')

const numberSelector = [
  '.section-number',
  '.accommodation-card__index',
  '.experience__chapter-number',
  '.property-gallery__caption > :last-child',
].join(',')

const magneticSelector = '.button:not(:disabled), .nav-booking, .gallery-arrow, .menu-toggle'
const imageSelector = '.interiors__image, .property-gallery__item'
const interactiveSelector = 'a[href], button:not(:disabled), [role="button"], [data-cursor="link"]'

function cursorStateFor(element: Element | null) {
  if (!element) return 'normal'
  if (element.closest('[data-cursor="drag"]')) return 'drag'
  if (element.closest(`${imageSelector}, .accommodation-card__button, .photo-lightbox figure img`)) return 'image'
  if (element.closest(interactiveSelector)) return 'link'
  return 'normal'
}

export function SiteMicroInteractions() {
  const cursor = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const body = document.body
    const cursorElement = cursor.current
    let active = false
    let activeMagnetic: HTMLElement | null = null
    let activeImage: HTMLElement | null = null
    let moveCursorX: ((value: number) => void) | null = null
    let moveCursorY: ((value: number) => void) | null = null
    let moveMagneticX: ((value: number) => void) | null = null
    let moveMagneticY: ((value: number) => void) | null = null
    let moveImageX: ((value: number) => void) | null = null
    let moveImageY: ((value: number) => void) | null = null

    const resetMagnetic = () => {
      moveMagneticX?.(0)
      moveMagneticY?.(0)
      activeMagnetic = null
      moveMagneticX = null
      moveMagneticY = null
    }
    const resetImage = () => {
      moveImageX?.(0)
      moveImageY?.(0)
      activeImage = null
      moveImageX = null
      moveImageY = null
    }
    const setCursorState = (element: Element | null) => {
      if (cursorElement) {
        const state = cursorStateFor(element)
        cursorElement.dataset.state = cursorElement.dataset.pressed === 'true' && state === 'image' ? 'drag' : state
      }
      const onFormControl = Boolean(element?.closest('input, textarea, select, [contenteditable="true"]'))
      body.classList.toggle('micro-native-cursor', onFormControl)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !cursorElement) return
      body.classList.remove('micro-keyboard-mode')
      cursorElement.dataset.visible = 'true'
      moveCursorX?.(event.clientX)
      moveCursorY?.(event.clientY)

      const target = event.target instanceof Element ? event.target : null
      setCursorState(target)

      let magnetic = target?.closest<HTMLElement>(magneticSelector) ?? null
      if (magnetic?.matches('.nav-booking') && window.innerWidth <= 900) magnetic = null
      if (magnetic !== activeMagnetic) {
        resetMagnetic()
        if (magnetic) {
          activeMagnetic = magnetic
          moveMagneticX = gsap.quickTo(magnetic, 'x', { duration: .38, ease: 'power3.out' })
          moveMagneticY = gsap.quickTo(magnetic, 'y', { duration: .38, ease: 'power3.out' })
        }
      }
      if (activeMagnetic && moveMagneticX && moveMagneticY) {
        const bounds = activeMagnetic.getBoundingClientRect()
        moveMagneticX((event.clientX - (bounds.left + bounds.width / 2)) * .11)
        moveMagneticY((event.clientY - (bounds.top + bounds.height / 2)) * .14)
      }

      const imageFrame = target?.closest<HTMLElement>(imageSelector) ?? null
      const image = imageFrame?.querySelector<HTMLElement>('img') ?? null
      if (image !== activeImage) {
        resetImage()
        if (image) {
          activeImage = image
          moveImageX = gsap.quickTo(image, 'x', { duration: .65, ease: 'power3.out' })
          moveImageY = gsap.quickTo(image, 'y', { duration: .65, ease: 'power3.out' })
        }
      }
      if (image && imageFrame && moveImageX && moveImageY) {
        const bounds = imageFrame.getBoundingClientRect()
        const x = (event.clientX - (bounds.left + bounds.width / 2)) / Math.max(1, bounds.width / 2)
        const y = (event.clientY - (bounds.top + bounds.height / 2)) / Math.max(1, bounds.height / 2)
        moveImageX(gsap.utils.clamp(-2.5, 2.5, x * 2.5))
        moveImageY(gsap.utils.clamp(-2.5, 2.5, y * 2.5))
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !cursorElement) return
      if (cursorStateFor(event.target instanceof Element ? event.target : null) === 'image') {
        cursorElement.dataset.state = 'drag'
        cursorElement.dataset.pressed = 'true'
      }
    }
    const onPointerUp = (event: PointerEvent) => {
      if (!cursorElement) return
      cursorElement.dataset.pressed = 'false'
      setCursorState(document.elementFromPoint(event.clientX, event.clientY))
    }
    const onPointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return
      if (cursorElement) cursorElement.dataset.visible = 'false'
      resetMagnetic()
      resetImage()
      body.classList.remove('micro-native-cursor')
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        body.classList.add('micro-keyboard-mode')
        body.classList.remove('micro-native-cursor')
        if (cursorElement) cursorElement.dataset.visible = 'false'
      }
    }

    const deactivate = () => {
      if (!active) return
      active = false
      const magneticTarget = activeMagnetic
      const imageTarget = activeImage
      body.classList.remove('has-micro-cursor', 'micro-keyboard-mode', 'micro-native-cursor')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointerout', onPointerLeave)
      window.removeEventListener('keydown', onKeyDown)
      resetMagnetic()
      resetImage()
      if (cursorElement) cursorElement.dataset.visible = 'false'
      gsap.killTweensOf([magneticTarget, imageTarget, cursorElement].filter((target): target is HTMLElement => target !== null))
    }
    const activate = () => {
      if (active || !finePointer.matches || reduceMotion.matches || !cursorElement) return
      active = true
      body.classList.add('has-micro-cursor')
      moveCursorX = gsap.quickTo(cursorElement, 'x', { duration: .14, ease: 'power3.out' })
      moveCursorY = gsap.quickTo(cursorElement, 'y', { duration: .14, ease: 'power3.out' })
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('pointerdown', onPointerDown, { passive: true })
      window.addEventListener('pointerup', onPointerUp, { passive: true })
      window.addEventListener('pointerout', onPointerLeave)
      window.addEventListener('keydown', onKeyDown)
    }
    const update = () => reduceMotion.matches || !finePointer.matches ? deactivate() : activate()

    finePointer.addEventListener('change', update)
    reduceMotion.addEventListener('change', update)
    update()
    return () => {
      finePointer.removeEventListener('change', update)
      reduceMotion.removeEventListener('change', update)
      deactivate()
    }
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | null = null
    const prepared: HTMLElement[] = []

    const clearReveal = () => {
      observer?.disconnect()
      observer = null
      prepared.forEach((element) => element.classList.remove('micro-heading-reveal', 'micro-number-reveal', 'is-visible'))
      prepared.length = 0
    }
    const prepareReveal = () => {
      clearReveal()
      if (reduced.matches) return

      const headings = Array.from(document.querySelectorAll<HTMLElement>(headingSelector))
      const numbers = Array.from(document.querySelectorAll<HTMLElement>(numberSelector))
      headings.forEach((element) => { element.classList.add('micro-heading-reveal'); prepared.push(element) })
      numbers.forEach((element) => { element.classList.add('micro-number-reveal'); prepared.push(element) })

      if (!('IntersectionObserver' in window)) {
        prepared.forEach((element) => element.classList.add('is-visible'))
        return
      }
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        })
      }, { rootMargin: '0px 0px -7% 0px', threshold: .12 })
      prepared.forEach((element) => observer?.observe(element))
    }

    prepareReveal()
    reduced.addEventListener('change', prepareReveal)
    return () => {
      reduced.removeEventListener('change', prepareReveal)
      clearReveal()
    }
  }, [])

  return <span className="site-cursor" ref={cursor} aria-hidden="true" data-visible="false" data-state="normal" data-pressed="false"><span /></span>
}
