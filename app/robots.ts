import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/quan-ly/',
    },
    sitemap: 'https://www.marshell.com.vn/sitemap.xml',
  }
}
