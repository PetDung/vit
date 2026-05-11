import { MetadataRoute } from 'next'
import { fetchProducts } from '@/lib/products'
import { fetchCnc } from '@/lib/cnc'
import { toSlug } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://marshell.vn'
  
  // Basic routes
  const routes = [
    '',
    '/dau-co-khi',
    '/dau-cnc',
    '/ve-chung-toi',
    '/kinh-nghiem',
    '/tin-tuc',
    '/lien-he',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Mechanical products
  const products = await fetchProducts()
  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/dau-co-khi/san-pham/${toSlug(p.name, p.id)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // CNC products
  const cncProducts = await fetchCnc()
  const cncRoutes = cncProducts.map((p) => ({
    url: `${baseUrl}/dau-cnc/san-pham/${toSlug(p.name, p.id)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...productRoutes, ...cncRoutes]
}
