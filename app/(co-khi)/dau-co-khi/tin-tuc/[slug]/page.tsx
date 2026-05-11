import { Metadata } from "next"
import { fetchNews, findNewsBySlug } from "@/lib/news"
import NewsDetailClientPage from "./client-page"
import { notFound } from "next/navigation"

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const allNews = await fetchNews()
    const article = findNewsBySlug(allNews, slug)

    if (!article) {
        return {
            title: "Không tìm thấy bài viết - Marshell",
        }
    }

    // Clean excerpt of HTML tags for description
    const plainDescription = article.excerpt.replace(/<[^>]*>/g, '').slice(0, 160)

    return {
        title: `${article.title} - Marshell`,
        description: plainDescription,
        openGraph: {
            title: article.title,
            description: plainDescription,
            type: "article",
            publishedTime: article.date,
            images: [
                {
                    url: article.image,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params
    const allNews = await fetchNews()
    const article = findNewsBySlug(allNews, slug)

    if (!article) {
        notFound()
    }

    const related = allNews.filter(a => a.id !== article.id).slice(0, 3)
 
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "image": [article.image],
        "datePublished": article.date,
        "description": article.excerpt.replace(/<[^>]*>/g, '').slice(0, 160),
        "author": {
            "@type": "Organization",
            "name": "Marshell"
        }
    }
 
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NewsDetailClientPage article={article} related={related} />
        </>
    )
}
