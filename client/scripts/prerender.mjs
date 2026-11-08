import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createServer } from 'vite'
import { canonicalUrl, PUBLIC_ROUTES } from '../seo.config.mjs'
import { createPageStructuredData, serializeJsonLd } from '../src/seo/structuredData.mjs'

const projectRoot = process.cwd()
const outputRoot = resolve(projectRoot, 'dist')
const template = await readFile(resolve(outputRoot, 'index.html'), 'utf8')
const vite = await createServer({
  configFile: resolve(projectRoot, 'vite.config.ts'),
  mode: 'production',
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

function applyRouteMetadata(html, route) {
  const url = canonicalUrl(route.path)
  const title = escapeAttribute(route.title)
  const description = escapeAttribute(route.description)
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*("\s*\/?>)/, `$1${route.image}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*("\s*\/?>)/, `$1${escapeAttribute(route.imageAlt)}$2`)
    .replace(/(<meta property="og:image:width" content=")[^"]*("\s*\/?>)/, `$1${route.imageWidth}$2`)
    .replace(/(<meta property="og:image:height" content=")[^"]*("\s*\/?>)/, `$1${route.imageHeight}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*("\s*\/?>)/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*("\s*\/?>)/, `$1${route.image}$2`)
    .replace(/(<script id="sooru-structured-data" type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
      `$1${serializeJsonLd(createPageStructuredData(route))}$2`)
}

try {
  const { renderRoute } = await vite.ssrLoadModule('/src/entry-server.tsx')

  for (const route of PUBLIC_ROUTES) {
    const content = renderRoute(route.path)
    if (!template.includes('<div id="root"></div>')) {
      throw new Error('Expected an empty #root element in the Vite HTML template.')
    }
    const page = applyRouteMetadata(template.replace('<div id="root"></div>', `<div id="root">${content}</div>`), route)
    const relativePath = route.path === '/' ? 'index.html' : `${route.path.replace(/^\/+|\/+$/g, '')}/index.html`
    const destination = resolve(outputRoot, relativePath)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, page)
    console.log(`Prerendered ${route.path}`)
  }
} finally {
  await vite.close()
}
