import { StrictMode, createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { PUBLIC_ROUTES } from '../seo.config.mjs'
import { SiteRouter } from './site/SiteRouter'

export function renderRoute(path: string) {
  const route = PUBLIC_ROUTES.find((candidate) => candidate.path === path)
  if (!route) throw new Error(`No prerendered page is registered for ${path}`)
  return renderToString(createElement(StrictMode, null, createElement(SiteRouter, { path: route.path })))
}
