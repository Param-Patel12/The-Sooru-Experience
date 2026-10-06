import { useState, type FormEvent } from 'react'
import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { bookingUrl } from '../data/siteContent'

type SubmissionState = 'idle' | 'sending' | 'success' | 'error'
type EnquiryResponse = { ok?: boolean; delivered?: boolean; error?: string }

export function EnquirySection() {
  const [status, setStatus] = useState<SubmissionState>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    setFeedback('')

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      })
      const result = await response.json().catch(() => ({})) as EnquiryResponse

      if (result.error === 'EMAIL_NOT_CONFIGURED' || result.error === 'SETUP_REQUIRED') {
        setStatus('error')
        setFeedback('The enquiry service is not fully set up yet. Please contact us through Airbnb for now.')
        return
      }

      if (!response.ok || result.ok !== true || result.delivered !== true) {
        throw new Error(result.error === 'RATE_LIMITED'
          ? 'Too many enquiries were sent from this connection. Please wait a little before trying again.'
          : 'Your enquiry could not be sent. Please try again, or contact us through Airbnb.')
      }
      setStatus('success')
      setFeedback('Thank you. Your enquiry has been sent.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error && error.name === 'Error'
        ? error.message
        : 'Your enquiry could not be sent. Please try again, or contact us through Airbnb.')
    }
  }

  return (
    <section className="enquiry section-pad" id="enquire" aria-labelledby="enquiry-title">
      <div className="enquiry__intro">
        <p className="eyebrow">Your days in the hills</p>
        <h2 id="enquiry-title">COME, STAY<br /><em>AWHILE.</em></h2>
        <p>Have a question about your stay?<br />Send us an enquiry.</p>
        <a className="button button--forest enquiry__booking" href={bookingUrl} target="_blank" rel="noopener noreferrer">
          BOOK ON AIRBNB <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <form className="enquiry-form" onSubmit={handleSubmit} aria-busy={status === 'sending'}>
        <div className="form-row">
          <label className="enquiry-field"><span className="enquiry-field__label">Name <span>(required)</span></span><input name="name" autoComplete="name" required maxLength={100} /></label>
          <label className="enquiry-field"><span className="enquiry-field__label">Email <span>(required)</span></span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        </div>
        <div className="form-row">
          <label className="enquiry-field"><span className="enquiry-field__label">Phone <span>(optional)</span></span><input name="phone" type="tel" autoComplete="tel" maxLength={30} /></label>
          <label className="enquiry-field"><span className="enquiry-field__label">Number of guests</span><input name="guests" type="number" min="1" max="30" step="1" required /></label>
        </div>
        <label className="enquiry-field"><span className="enquiry-field__label">Message <span>(required)</span></span><textarea name="message" rows={3} required minLength={5} maxLength={2000} /></label>
        <div className="enquiry-form__honey" aria-hidden="true">
          <label>Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <button className="button button--forest form-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? <><LoaderCircle className="form-submit__spinner" size={16} aria-hidden="true" /> Sending…</> : <>Send an enquiry <ArrowUpRight size={16} aria-hidden="true" /></>}
        </button>
        <p className={`form-feedback${status === 'error' ? ' form-feedback--error' : ''}${status === 'success' ? ' form-feedback--success' : ''}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{feedback}</p>
      </form>
    </section>
  )
}
