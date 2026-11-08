import { StrictMode, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { SITE_ORIGIN } from '../seo.config.mjs'
import './index.css'
import { SiteRouter } from './site/SiteRouter'

const rootElement = document.getElementById('root')!
const primaryOrigin = new URL(SITE_ORIGIN)
const currentHost = window.location.hostname.toLowerCase()
const needsCanonicalRedirect = currentHost !== primaryOrigin.hostname || window.location.protocol !== primaryOrigin.protocol

if (needsCanonicalRedirect) {
  const canonicalLocation = new URL(window.location.href)
  canonicalLocation.protocol = primaryOrigin.protocol
  canonicalLocation.host = primaryOrigin.host
  window.location.replace(canonicalLocation.href)
} else {
  const application = createElement(StrictMode, null, createElement(SiteRouter, { path: window.location.pathname }))

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, application)
  } else {
    createRoot(rootElement).render(application)
  }
}
