export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  views: number;
  category: string;
  featured: boolean;
  published?: boolean;
}

import { toSlug } from '@/lib/utils'

export function findNewsBySlug(news: NewsArticle[], slug: string): NewsArticle | undefined {
  return news.find((p) => toSlug(p.title, p.id) === slug) || news.find((p) => slug.endsWith(p.id));
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(`${API}/news`, { cache: "no-store" })
    if (!res.ok) throw new Error("API Error")
    return res.json()
  } catch {
    return []
  }
}
