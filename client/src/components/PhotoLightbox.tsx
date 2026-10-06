import { useCallback, useEffect, useId, useRef, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { PropertyImage } from './PropertyImage'

export interface GalleryPhoto {
  image: string
  alt: string
  caption: string
  width: number
  height: number
}

interface PhotoLightboxProps {
  photos: GalleryPhoto[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  open: boolean
  onClose: () => void
  label: string
}

export function PhotoLightbox({ photos, activeIndex, onActiveIndexChange, open, onClose, label }: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const instructionsId = useId()
  const activePhoto = photos[activeIndex]

  const showPrevious = useCallback(() => {
    onActiveIndexChange((activeIndex - 1 + photos.length) % photos.length)
  }, [activeIndex, onActiveIndexChange, photos.length])

  const showNext = useCallback(() => {
    onActiveIndexChange((activeIndex + 1) % photos.length)
  }, [activeIndex, onActiveIndexChange, photos.length])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()
    dialog.querySelector<HTMLButtonElement>('.photo-lightbox__close')?.focus()

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPrevious()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      showNext()
    }
  }

  return (
    <dialog
      className="photo-lightbox"
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={instructionsId}
      onKeyDown={handleKeyDown}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <h2 className="visually-hidden" id={titleId}>{label}</h2>
      <button className="photo-lightbox__close" type="button" aria-label="Close enlarged photograph" onClick={onClose}><X size={22} aria-hidden="true" /></button>
      <button className="photo-lightbox__arrow photo-lightbox__arrow--previous" type="button" aria-label="Previous photograph" onClick={showPrevious}><ArrowLeft size={21} aria-hidden="true" /></button>
      <figure>
        <PropertyImage src={activePhoto.image} alt={activePhoto.alt} width={activePhoto.width} height={activePhoto.height} loading={open ? 'eager' : 'lazy'} fetchPriority={open ? 'high' : 'auto'} decoding="async" />
        <figcaption>{activePhoto.caption}<span>{activeIndex + 1} / {photos.length}</span></figcaption>
      </figure>
      <button className="photo-lightbox__arrow photo-lightbox__arrow--next" type="button" aria-label="Next photograph" onClick={showNext}><ArrowRight size={21} aria-hidden="true" /></button>
      <p className="visually-hidden" id={instructionsId}>Use the left and right arrow keys to change photographs. Press Escape to close.</p>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">Photograph {activeIndex + 1} of {photos.length}: {activePhoto.caption}</p>
    </dialog>
  )
}
