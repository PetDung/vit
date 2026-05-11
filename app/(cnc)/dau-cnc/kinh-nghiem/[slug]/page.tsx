import { Metadata } from "next"
import { fetchExperience, findExperienceBySlug } from "@/lib/experience"
import ExperienceDetailClientPage from "./client-page"
import { notFound } from "next/navigation"
 
type Props = {
    params: Promise<{ slug: string }>
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const allArticles = await fetchExperience()
    const article = findExperienceBySlug(allArticles, slug)
 
    if (!article) {
        return {
            title: "Không tìm thấy bài viết - Marshell",
        }
    }
 
    const plainDescription = article.excerpt.replace(/<[^>]*>/g, '').slice(0, 160)
 
    return {
        title: `${article.title} - Kinh nghiệm Marshell`,
        description: plainDescription,
        openGraph: {
            title: article.title,
            description: plainDescription,
            type: "article",
            publishedTime: article.date,
            images: [{ url: article.image }],
        },
    }
}
 
export default async function ExperienceDetailPage({ params }: Props) {
    const { slug } = await params
    const allArticles = await fetchExperience()
    const article = findExperienceBySlug(allArticles, slug)
 
    if (!article) {
        notFound()
    }
 
    const related = allArticles.filter(a => a.id !== article.id).slice(0, 3)
 
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
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
            <ExperienceDetailClientPage article={article} related={related} />
        </>
    )
}
