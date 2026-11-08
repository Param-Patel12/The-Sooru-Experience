import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { canonicalUrl, PUBLIC_ROUTES, SITE_DESCRIPTION, SITE_OG_IMAGE, SITE_ORIGIN, SITE_TITLE } from './seo.config.mjs'
import { createPageStructuredData, serializeJsonLd } from './src/seo/structuredData.mjs'

const structuredData = serializeJsonLd(createPageStructuredData(PUBLIC_ROUTES[0]))

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'sooru-production-metadata',
        transformIndexHtml(html) {
          const route = PUBLIC_ROUTES[0]
          return html
            .replaceAll('__SOORU_TITLE__', route.title || SITE_TITLE)
            .replaceAll('__SOORU_DESCRIPTION__', route.description || SITE_DESCRIPTION)
            .replaceAll('__SOORU_CANONICAL__', canonicalUrl(route.path))
            .replaceAll('__SOORU_OG_IMAGE__', PUBLIC_ROUTES[0].image || SITE_OG_IMAGE)
            .replaceAll('__SOORU_STRUCTURED_DATA__', structuredData)
        },
        generateBundle() {
          const bundle = this as typeof this & { emitFile: (file: { type: 'asset'; fileName: string; source: string }) => void }
          const robots = [
            'User-agent: *',
            'Allow: /',
            '',
            `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
            '',
          ].join('\n')
          bundle.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
          const sitemapEntries = PUBLIC_ROUTES
            .map((route) => `  <url><loc>${canonicalUrl(route.path)}</loc></url>`)
            .join('\n')
          const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
          bundle.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
        },
      },
    ],
  }
})
