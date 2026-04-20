export interface ExperienceArticle {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  views: number;
  published?: boolean;
}

import { toSlug } from '@/lib/utils'

export function findExperienceBySlug(articles: ExperienceArticle[], slug: string): ExperienceArticle | undefined {
  return articles.find((p) => toSlug(p.title, p.id) === slug) || articles.find((p) => slug.endsWith(p.id));
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export async function fetchExperience(): Promise<ExperienceArticle[]> {
  try {
    const res = await fetch(`${API}/experience`, { cache: "no-store" })
    if (!res.ok) throw new Error("API Error")
    return res.json()
  } catch {
    return []
  }
}
