import { Metadata, ResolvingMetadata } from 'next'
import { fetchNews, findNewsBySlug } from '@/lib/news'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const resolvedParams = await params
  const news = await fetchNews()
  const article = findNewsBySlug(news, resolvedParams.slug)

  if (!article) {
    return {
      title: "Không tìm thấy bài viết | Marshell",
    }
  }

  const cleanDescription = (article.excerpt || "").replace(/<[^>]*>?/gm, '').substring(0, 160)

  return {
    title: `${article.title} | Marshell Tin Tức`,
    description: cleanDescription,
  }
}

export default function NewsArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
