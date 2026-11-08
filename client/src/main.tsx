import { StrictMode, createElement } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import { SiteRouter } from './site/SiteRouter'

const rootElement = document.getElementById('root')!
const application = createElement(StrictMode, null, createElement(SiteRouter, { path: window.location.pathname }))

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, application)
} else {
  createRoot(rootElement).render(application)
}
