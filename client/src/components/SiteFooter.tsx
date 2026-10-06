import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { bookingUrl, instagramUrl, photographs } from '../data/siteContent'
import { PropertyImage } from './PropertyImage'

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="The Sooru Experience footer">
      <div className="site-footer__backdrop" aria-hidden="true">
        <PropertyImage src={photographs.exterior} alt="" width={1024} height={1024} loading="lazy" decoding="async" />
      </div>
      <div className="site-footer__topline"><span>THE SOORU EXPERIENCE</span><span>CHIKKAMAGALURU · KARNATAKA</span></div>
      <div className="site-footer__main">
        <p className="site-footer__invitation">Where the hills feel like home.</p>
        <a className="wordmark wordmark--footer" href="#top" aria-label="Back to the beginning">
          <span className="wordmark__name">sooru</span>
          <span className="wordmark__descriptor">A MALNAD HOMESTAY</span>
        </a>
      </div>
      <div className="site-footer__bottom">
        <div className="site-footer__links">
          <a className="site-footer__book" href={bookingUrl} target="_blank" rel="noopener noreferrer">BOOK ON AIRBNB <ArrowUpRight size={15} aria-hidden="true" /></a>
          <a className="footer-social" href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Follow The Sooru Experience on Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r=".8" fill="currentColor" /></svg>
            Instagram <ArrowUpRight size={13} aria-hidden="true" />
          </a>
          <a className="site-footer__top" href="#top">Back to top <ArrowUp size={14} aria-hidden="true" /></a>
        </div>
        <span className="footer-copy">&copy; {new Date().getFullYear()} The Sooru Experience</span>
      </div>
    </footer>
  )
}
