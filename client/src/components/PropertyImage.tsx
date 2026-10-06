import type { ImgHTMLAttributes } from 'react'

type PropertyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string
}

export function PropertyImage({ src, ...imageProps }: PropertyImageProps) {
  const webpSrc = src.replace(/\.jpe?g$/i, '.webp')

  return (
    <picture className="property-image">
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} {...imageProps} />
    </picture>
  )
}
