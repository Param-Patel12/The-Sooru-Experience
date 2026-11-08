import type { ImgHTMLAttributes } from 'react'

type PropertyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string
  webp?: boolean
}

export function PropertyImage({ src, webp = true, ...imageProps }: PropertyImageProps) {
  const webpSrc = src.replace(/\.jpe?g$/i, '.webp')

  return (
    <picture className="property-image">
      {webp && <source srcSet={webpSrc} type="image/webp" />}
      <img src={src} {...imageProps} />
    </picture>
  )
}
