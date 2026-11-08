import { ArrowUpRight } from 'lucide-react'
import { AIRBNB_BOOKING_URL } from '../../seo.config.mjs'
import { trackAirbnbBookingClick } from '../analytics/ga4.mjs'

export type BookingButtonLabel = 'Check Availability' | 'View on Airbnb' | 'Book Your Stay'

interface BookingButtonProps {
  label: BookingButtonLabel
  location: string
  className?: string
  variant?: 'forest' | 'light' | 'link'
}

export function BookingButton({ label, location, className = '', variant = 'forest' }: BookingButtonProps) {
  return (
    <a
      className={`${variant === 'link' ? '' : `button button--${variant}`} ${className}`.trim()}
      href={AIRBNB_BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAirbnbBookingClick({ buttonLocation: location })}
    >
      {label}<ArrowUpRight size={15} aria-hidden="true" />
    </a>
  )
}
