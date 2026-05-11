import { redirect } from "next/navigation"
import { fetchCnc } from "@/lib/cnc"
import { toSlug } from "@/lib/utils"

export default async function CncSanPhamPage() {
    const products = await fetchCnc()

    if (products.length > 0) {
        const firstProduct = products[0]
        const slug = toSlug(firstProduct.name, firstProduct.id)
        redirect(`/dau-cnc/san-pham/${slug}`)
    }

    redirect("/dau-cnc")
}
