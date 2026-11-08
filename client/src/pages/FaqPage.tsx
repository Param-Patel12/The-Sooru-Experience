import { ArrowUpRight } from 'lucide-react'
import { ContentPageLayout } from '../components/ContentPageLayout'
import { PageHero } from '../components/PageHero'
import { BookingButton } from '../components/BookingButton'
import { photographs } from '../data/siteContent'
import { faqItems } from '../data/faqContent'

export function FaqPage() {
  return (
    <ContentPageLayout currentPath="/faq/" className="editorial-page--faq">
      <PageHero
        eyebrow="Planning a visit"
        title="Frequently Asked Questions"
        introduction="Find essential information about the location, rooms, and how to book The Sooru Experience."
        image={photographs.courtyard}
        imageAlt="The traditional inner courtyard with a wooden swing and terracotta floors"
        imageWidth={853}
        imageHeight={1280}
        action={{ label: 'Check Availability', location: 'faq.hero' }}
      />
      <section className="editorial-section editorial-faq" aria-labelledby="faq-list-title">
        <div><p className="eyebrow">A few useful details</p><h2 id="faq-list-title">Before your stay.</h2></div>
        <div className="editorial-faq__list">
          {faqItems.map((item) => (
            <details className="editorial-faq__item" key={item.question}>
              <summary>{item.question}</summary>
              <div className="editorial-faq__answer">
                <p>{item.answer}</p>
                {item.link?.external
                  ? <BookingButton className="text-link" label="View on Airbnb" location="faq.answer" variant="link" />
                  : item.link && <a className="text-link" href={item.link.href}>{item.link.label} <ArrowUpRight size={15} aria-hidden="true" /></a>}
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="editorial-link-band">
        <div><p className="eyebrow">Ready when you are</p><h2>Check the current listing on Airbnb.</h2></div>
        <BookingButton label="View on Airbnb" location="faq.booking-band" />
      </section>
    </ContentPageLayout>
  )
}
