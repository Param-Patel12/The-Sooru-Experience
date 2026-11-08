import { PropertyImage } from './PropertyImage'
import { BookingButton, type BookingButtonLabel } from './BookingButton'

interface PageHeroProps {
  eyebrow: string
  title: string
  introduction: string
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  action?: { label: BookingButtonLabel; location: string }
}

export function PageHero({ eyebrow, title, introduction, image, imageAlt, imageWidth, imageHeight, action }: PageHeroProps) {
  return (
    <section className="editorial-hero" aria-labelledby="page-title">
      <PropertyImage className="editorial-hero__image" src={image} alt={imageAlt} width={imageWidth} height={imageHeight} fetchPriority="high" decoding="async" />
      <span className="editorial-hero__shade" aria-hidden="true" />
      <div className="editorial-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-title">{title}</h1>
        <p className="editorial-hero__intro">{introduction}</p>
        {action && (
          <BookingButton label={action.label} location={action.location} variant="light" />
        )}
      </div>
    </section>
  )
}
