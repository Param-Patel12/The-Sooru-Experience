import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = env.VITE_SITE_URL
    || env.VITE_VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_PROJECT_PRODUCTION_URL
  let siteOrigin: string | undefined
  if (siteUrl) {
    try {
      const normalized = new URL(siteUrl.startsWith('http') ? siteUrl : 'https://' + siteUrl)
      if (normalized.protocol === 'http:' || normalized.protocol === 'https:') siteOrigin = normalized.origin
    } catch {
      throw new Error('VITE_SITE_URL must be a valid production website URL.')
    }
  }
  const socialPreviewBlock = /<!-- social-preview:start -->[\s\S]*?<!-- social-preview:end -->/
  const canonicalBlock = /<!-- canonical:start -->[\s\S]*?<!-- canonical:end -->/
  const description = 'Stay at The Sooru Experience, a peaceful Malnad homestay surrounded by the green hills of Chikkamagaluru, Karnataka. Discover the home, explore the surroundings, and enquire about your stay.'
  const structuredData = siteOrigin ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': siteOrigin + '/#lodging',
    name: 'The Sooru Experience',
    description,
    url: siteOrigin + '/',
    image: [siteOrigin + '/images/exterior/sooru-exterior.webp'],
    sameAs: [
      'https://www.instagram.com/thesooruexperience/',
      'https://www.airbnb.co.uk/rooms/1483328101335591480',
    ],
  }).replaceAll('<', '\\u003c') : undefined

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'sooru-production-metadata',
        transformIndexHtml(html) {
          const cleanHtml = html.replace(/^P(?=<!doctype html>)/i, '')
          if (!siteOrigin || !structuredData) return cleanHtml.replace(socialPreviewBlock, '').replace(canonicalBlock, '')
          return cleanHtml
            .replace(socialPreviewBlock, (block) => block.replaceAll('__SOORU_SITE_URL__', siteOrigin))
            .replace(canonicalBlock, (block) => block.replace('__SOORU_SITE_URL__', siteOrigin).replace('__SOORU_STRUCTURED_DATA__', structuredData))
        },
        generateBundle() {
          const bundle = this as typeof this & { emitFile: (file: { type: 'asset'; fileName: string; source: string }) => void }
          const robots = [
            'User-agent: *',
            'Allow: /',
            ...(siteOrigin ? ['', 'Sitemap: ' + siteOrigin + '/sitemap.xml'] : []),
            '',
          ].join('\n')
          bundle.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
          if (siteOrigin) {
            const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>' + siteOrigin + '/</loc></url>\n</urlset>\n'
            bundle.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
          }
        },
      },
    ],
  }
})
