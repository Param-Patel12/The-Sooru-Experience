import { photographs } from '../data/siteContent'
import { PropertyImage } from '../components/PropertyImage'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function InteriorsSection() {
  const section = useScrollReveal<HTMLElement>()

  return (
    <section className="interiors section-pad" id="interiors" aria-labelledby="interiors-title" ref={section}>
      <div className="interiors__heading" data-reveal>
        <p className="eyebrow">Come together, slow down <span className="section-number">04 — 04</span></p>
        <h2 id="interiors-title">The comfort<br />of <em>being here.</em></h2>
      </div>
      <div className="interiors__grid">
        <figure className="interiors__image interiors__image--seating" data-reveal>
          <PropertyImage src={photographs.seating} alt="Wooden chairs and a long bench in a warm, terracotta-floored interior" width={960} height={1280} loading="lazy" decoding="async" />
          <figcaption><span>Places to settle in</span><span>Wood · terracotta</span></figcaption>
        </figure>
        <div className="interiors__side" data-reveal>
          <p className="interiors__copy">The everyday spaces are part of the stay: wood warmed by the light, familiar textures, and room to spend time together.</p>
          <figure className="interiors__image interiors__image--dining">
            <PropertyImage src={photographs.dining} alt="A wooden dining table and chairs beside bright curtained windows" width={959} height={1280} loading="lazy" decoding="async" />
            <figcaption><span>Gather around the table</span><span>Daylight in the dining room</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
