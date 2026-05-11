import { fetchCnc, findCncBySlug } from "@/lib/cnc"
import { toSlug } from "@/lib/utils"
import ProductClientPage from "./client-page"
import { Metadata } from 'next'
 
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const products = await fetchCnc()
    const product = findCncBySlug(products, slug)
 
    if (!product) {
        return {
            title: "Sản phẩm không tồn tại - Marshell",
            description: "Không tìm thấy sản phẩm bạn yêu cầu."
        }
    }
 
    return {
        title: `${product.name} - Dầu Nhớt Marshell Chính Hãng`,
        description: product.description.replace(/<[^>]*>?/gm, '').substring(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.replace(/<[^>]*>?/gm, '').substring(0, 160),
            images: [product.image],
            type: 'website'
        }
    }
}
 
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const products = await fetchCnc()
 
    // Structured Data (JSON-LD)
    const product = findCncBySlug(products, slug)
    const jsonLd = product ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [product.image, ...(product.images || [])],
        "description": product.description.replace(/<[^>]*>?/gm, ''),
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Marshell"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://www.marshell.com.vn/dau-cnc/san-pham/${toSlug(product.name, product.id)}`,
            "priceCurrency": "VND",
            "availability": "https://schema.org/InStock"
        }
    } : null
 
    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductClientPage initialProducts={products as any} slug={slug} />
        </>
    )
}

