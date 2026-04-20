import { redirect } from "next/navigation"
import { fetchProducts, toSlug } from "@/lib/products"

export default async function SanPhamPage() {
    const products = await fetchProducts()

    if (products.length > 0) {
        const firstProduct = products[0]
        const slug = toSlug(firstProduct.name, firstProduct.id)
        redirect(`/san-pham/${slug}`)
    }

    redirect("/")
}