import type { ImgHTMLAttributes } from 'react'

type PropertyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  src: string
  webp?: boolean
  responsiveSrcSet?: string
  responsiveWebpSrcSet?: string
}

export function PropertyImage({ src, webp = true, responsiveSrcSet, responsiveWebpSrcSet, ...imageProps }: PropertyImageProps) {
  const webpSrc = src.replace(/\.jpe?g$/i, '.webp')

  return (
    <picture className="property-image">
      {webp && <source srcSet={responsiveWebpSrcSet ?? webpSrc} type="image/webp" />}
      <img src={src} srcSet={responsiveSrcSet} {...imageProps} />
    </picture>
  )
}
