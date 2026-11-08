export interface StructuredDataRoute {
  path: string
  title: string
  description: string
  image: string
  imageAlt: string
  breadcrumb?: string
  navLabel?: string
}

export function createBusinessEntity(options?: { image?: string }): Record<string, unknown>
export function createBreadcrumbSchema(route: StructuredDataRoute): Record<string, unknown>
export function createPageStructuredData(route: StructuredDataRoute): Record<string, unknown>
export function createArticleSchema(input: {
  url: string
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  authorName?: string
}): Record<string, unknown>
export function serializeJsonLd(value: unknown): string
