import { useEffect } from 'react'
import { initializeGA4, trackPageView } from '../analytics/ga4.mjs'

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

export function AnalyticsBootstrap({ pagePath }: { pagePath: string }) {
  useEffect(() => {
    if (!initializeGA4({ measurementId })) return

    const sendCurrentPageView = () => trackPageView(window.location.pathname)
    sendCurrentPageView()
    window.addEventListener('popstate', sendCurrentPageView)
    window.addEventListener('sooru:navigation', sendCurrentPageView)
    return () => {
      window.removeEventListener('popstate', sendCurrentPageView)
      window.removeEventListener('sooru:navigation', sendCurrentPageView)
    }
  }, [pagePath])

  return null
}
