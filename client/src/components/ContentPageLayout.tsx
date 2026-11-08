import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { SiteMicroInteractions } from './SiteMicroInteractions'

interface ContentPageLayoutProps {
  children: ReactNode
  currentPath: string
  className?: string
}

export function ContentPageLayout({ children, currentPath, className = '' }: ContentPageLayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader currentPath={currentPath} />
      <main id="main-content">
        <div className={`editorial-page ${className}`} id="top">{children}</div>
      </main>
      <SiteFooter />
      <SiteMicroInteractions />
    </>
  )
}
