import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { bookingUrl } from '../data/siteContent'

const links = [
  { href: '#story', label: 'Our story' },
  { href: '#courtyard', label: 'Courtyard' },
  { href: '#accommodation', label: 'Bedrooms' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#location', label: 'Location' },
  { href: '#enquire', label: 'Enquire' },
]

function motionReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeLink, setActiveLink] = useState('')
  const menuToggleRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const menuTimeline = useRef<gsap.core.Timeline | null>(null)
  const isClosing = useRef(false)
  const pendingAfterClose = useRef<(() => void) | null>(null)

  const closeMenu = useCallback((afterClose?: () => void) => {
    if (!menuOpen) {
      afterClose?.()
      return
    }
    if (afterClose) pendingAfterClose.current = afterClose
    if (isClosing.current) return
    if (motionReduced() || !menuTimeline.current) {
      setMenuOpen(false)
      menuToggleRef.current?.focus()
      pendingAfterClose.current?.()
      pendingAfterClose.current = null
      return
    }
    isClosing.current = true
    menuTimeline.current.reverse()
  }, [menuOpen])

  useEffect(() => {
    let frame = 0
    const updateHeader = () => {
      frame = 0
      const compact = window.scrollY > 58
      setScrolled((current) => current === compact ? current : compact)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader)
    }
    updateHeader()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const observed = links
      .map((link) => ({ id: link.href.slice(1), element: document.getElementById(link.href.slice(1)) }))
      .filter((item): item is { id: string; element: HTMLElement } => item.element instanceof HTMLElement)
    if (!('IntersectionObserver' in window) || observed.length === 0) return

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0]
      if (visible) setActiveLink((visible.target as HTMLElement).id)
    }, { rootMargin: '-30% 0px -58% 0px', threshold: 0 })
    observed.forEach(({ element }) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!menuOpen || !navRef.current || !menuToggleRef.current) return
    const nav = navRef.current
    const toggleBounds = menuToggleRef.current.getBoundingClientRect()
    nav.style.setProperty('--menu-origin-x', `${toggleBounds.left + toggleBounds.width / 2}px`)
    nav.style.setProperty('--menu-origin-y', `${toggleBounds.top + toggleBounds.height / 2}px`)
    const items = nav.querySelectorAll<HTMLElement>('.site-nav__entry')
    const context = gsap.context(() => {
      if (motionReduced()) {
        gsap.set(nav, { autoAlpha: 1, clipPath: 'circle(150vmax at var(--menu-origin-x) var(--menu-origin-y))' })
        menuToggleRef.current?.focus()
        return
      }

      gsap.set(nav, { autoAlpha: 1, clipPath: 'circle(0px at var(--menu-origin-x) var(--menu-origin-y))' })
      gsap.set(items, { autoAlpha: 0, x: -22, y: 12 })
      const timeline = gsap.timeline({
        onComplete: () => nav.querySelector<HTMLElement>('.site-nav__link')?.focus(),
        onReverseComplete: () => {
          isClosing.current = false
          menuTimeline.current = null
          setMenuOpen(false)
          menuToggleRef.current?.focus()
          pendingAfterClose.current?.()
          pendingAfterClose.current = null
        },
      })
      timeline.to(nav, {
        clipPath: 'circle(150vmax at var(--menu-origin-x) var(--menu-origin-y))',
        duration: .82,
        ease: 'power4.inOut',
      }).to(items, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: .48,
        stagger: .075,
        ease: 'power3.out',
      }, '-=.4')
      menuTimeline.current = timeline
    }, nav)

    if (motionReduced()) {
      menuToggleRef.current.focus()
    } else {
      menuTimeline.current?.play(0)
    }
    return () => context.revert()
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }
      if (event.key !== 'Tab' || !navRef.current) return
      const linksInMenu = Array.from(navRef.current.querySelectorAll<HTMLElement>('a[href]'))
      const first = linksInMenu[0]
      const last = linksInMenu[linksInMenu.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        menuToggleRef.current?.focus()
      } else if (event.shiftKey && document.activeElement === menuToggleRef.current) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        menuToggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen, closeMenu])

  useEffect(() => {
    if (!menuOpen) return
    const desktopQuery = window.matchMedia('(min-width: 901px)')
    const onBreakpointChange = () => {
      if (!desktopQuery.matches) return
      menuTimeline.current?.kill()
      menuTimeline.current = null
      isClosing.current = false
      setMenuOpen(false)
    }
    desktopQuery.addEventListener('change', onBreakpointChange)
    return () => desktopQuery.removeEventListener('change', onBreakpointChange)
  }, [menuOpen])

  function openMenu() {
    isClosing.current = false
    setMenuOpen(true)
  }

  function navigateTo(href: string, fromMenu = false) {
    const go = () => {
      document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior: motionReduced() ? 'auto' : 'smooth', block: 'start' })
    }
    if (fromMenu) closeMenu(go)
    else go()
  }

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}${menuOpen ? ' site-header--menu-open' : ''}`}>
      <a className="wordmark" href="#top" tabIndex={menuOpen ? -1 : undefined} aria-label="The Sooru Experience home" onClick={(event) => { event.preventDefault(); navigateTo('#top', menuOpen) }}>
        <span className="wordmark__name">sooru</span>
        <span className="wordmark__descriptor">THE SOORU EXPERIENCE</span>
      </a>

      <button
        className="menu-toggle"
        ref={menuToggleRef}
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => menuOpen ? closeMenu() : openMenu()}
      >
        {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>

      <nav id="primary-navigation" ref={navRef} className={`site-nav${menuOpen ? ' site-nav--open' : ''}`} aria-label="Main navigation">
        <div className="site-nav__masthead" aria-hidden="true">
          <span>THE SOORU EXPERIENCE</span><span>CHIKKAMAGALURU · KARNATAKA</span>
        </div>
        <div className="site-nav__links">
          {links.map((link, index) => (
            <a
              key={link.href}
              className={`site-nav__link site-nav__entry${activeLink === link.href.slice(1) ? ' is-active' : ''}`}
              href={link.href}
              aria-current={activeLink === link.href.slice(1) ? 'location' : undefined}
              onClick={(event) => { event.preventDefault(); navigateTo(link.href, menuOpen) }}
            >
              <span className="site-nav__number">{String(index + 1).padStart(2, '0')}</span><span>{link.label}</span>
            </a>
          ))}
        </div>
        <a className="nav-booking site-nav__entry" href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => menuOpen && closeMenu()}>
          <span>Find us on Airbnb</span><ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </nav>
    </header>
  )
}
