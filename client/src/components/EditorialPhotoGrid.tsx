import { PropertyImage } from './PropertyImage'

export interface EditorialPhoto {
  image: string
  alt: string
  caption?: string
  width: number
  height: number
}

export function EditorialPhotoGrid({ photos, label }: { photos: EditorialPhoto[]; label: string }) {
  return (
    <div className="editorial-photo-grid" role="group" aria-label={label}>
      {photos.map((photo) => (
        <figure className="editorial-photo" key={photo.image}>
          <PropertyImage src={photo.image} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
          {photo.caption && <figcaption>{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}
