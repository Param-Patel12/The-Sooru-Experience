import type { ComponentType } from 'react'
import { AnalyticsBootstrap } from '../components/AnalyticsBootstrap'
import SitePage from './SitePage'
import { AboutPage } from '../pages/AboutPage'
import { ExperiencesPage } from '../pages/ExperiencesPage'
import { FaqPage } from '../pages/FaqPage'
import { GalleryPage } from '../pages/GalleryPage'
import { LocationPage } from '../pages/LocationPage'
import { StayPage } from '../pages/StayPage'

const pageByPath: Record<string, ComponentType> = {
  '/': SitePage,
  '/stay/': StayPage,
  '/location/': LocationPage,
  '/experiences/': ExperiencesPage,
  '/gallery/': GalleryPage,
  '/faq/': FaqPage,
  '/about/': AboutPage,
}

function normalizePath(path: string) {
  if (path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}/`
}

export function SiteRouter({ path }: { path: string }) {
  const Page = pageByPath[normalizePath(path)]
  const ResolvedPage = Page || SitePage
  return <><ResolvedPage /><AnalyticsBootstrap pagePath={normalizePath(path)} /></>
}
