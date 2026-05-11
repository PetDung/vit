import { fetchProducts, findBySlug, toSlug } from "@/lib/products"
import ProductClientPage from "./client-page"
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const products = await fetchProducts()
    const product = findBySlug(products, slug)

    if (!product) {
        return {
            title: "Sản phẩm không tồn tại - Marshell",
            description: "Không tìm thấy sản phẩm bạn yêu cầu."
        }
    }

    const productUrl = `https://marshell.vn/san-pham/${toSlug(product.name, product.id)}`
    const cleanDesc = product.description?.replace(/<[^>]*>?/gm, '').substring(0, 160) || ''

    return {
        title: `${product.name} - Dầu Nhớt Công Nghiệp Marshell Chính Hãng`,
        description: cleanDesc,
        keywords: [product.name, 'dầu nhớt công nghiệp', 'dầu thủy lực', 'dầu diesel', 'marshell'],
        alternates: {
            canonical: productUrl,
        },
        openGraph: {
            title: `${product.name} - Dầu Nhớt Marshell`,
            description: cleanDesc,
            url: productUrl,
            siteName: 'Marshell Vietnam',
            type: 'website',
            images: [
                {
                    url: product.image,
                    width: 800,
                    height: 800,
                    alt: product.name
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} - Dầu Nhớt Marshell`,
            description: cleanDesc,
            images: [product.image],
        }
    }
}
 
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const products = await fetchProducts()
 
    // Structured Data (JSON-LD)
    const product = findBySlug(products, slug)
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
            "url": `https://www.marshell.com.vn/dau-co-khi/san-pham/${toSlug(product.name, product.id)}`,
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
            <ProductClientPage initialProducts={products} slug={slug} />
        </>
    )
}
