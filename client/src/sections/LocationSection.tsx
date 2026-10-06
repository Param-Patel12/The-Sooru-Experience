import { ArrowUpRight } from 'lucide-react'
import { bookingUrl } from '../data/siteContent'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function LocationSection() {
  const section = useScrollReveal<HTMLElement>()

  return (
    <section className="location section-pad" id="location" aria-labelledby="location-title" ref={section}>
      <div className="location__intro" data-reveal>
        <p className="eyebrow">A little way into the green</p>
        <h2 id="location-title">Find us in<br /><em>Malnad.</em></h2>
        <p>The Sooru Experience is in the Chikkamagaluru / Mudigere region of Karnataka, India.</p>
      </div>
      <div className="location__card" data-reveal>
        <div className="location__mark" aria-hidden="true"><span /></div>
        <p className="location__label">THE REGION</p>
        <address>Chikkamagaluru / Mudigere<br />Karnataka, India</address>
        <p className="location__note">In the green hill country of Malnad, with the wider region known for coffee-growing landscapes.</p>
        <a className="location__link" href={bookingUrl} target="_blank" rel="noopener noreferrer">View the Airbnb listing <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
