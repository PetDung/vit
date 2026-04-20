import { MetadataRoute } from 'next'
import { fetchProducts } from '@/lib/products'
import { fetchNews } from '@/lib/news'
import { fetchExperience } from '@/lib/experience'
import { toSlug } from '@/lib/utils'
 
const URL = 'https://www.marshell.com.vn'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch data
  const [products, news, experience] = await Promise.all([
    fetchProducts(),
    fetchNews(),
    fetchExperience(),
  ])
 
  const productEntries = products.map((p) => ({
    url: `${URL}/san-pham/${toSlug(p.name, p.id)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
 
  const newsEntries = news.map((n) => ({
    url: `${URL}/tin-tuc/${toSlug(n.title, n.id)}`,
    lastModified: new Date(n.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
 
  const experienceEntries = experience.map((e) => ({
    url: `${URL}/kinh-nghiem/${toSlug(e.title, e.id)}`,
    lastModified: new Date(e.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))
 
  const staticPages = [
    '',
    '/san-pham',
    '/tin-tuc',
    '/kinh-nghiem',
    '/ve-chung-toi',
    '/lien-he',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }))
 
  return [...staticPages, ...productEntries, ...newsEntries, ...experienceEntries]
}
