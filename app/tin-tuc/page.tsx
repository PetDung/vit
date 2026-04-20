import { Metadata } from "next"
import NewsClientPage from "./client-page"

export const metadata: Metadata = {
    title: "Tin Tức & Sự Kiện - Marshell | Dầu Nhớt Thành Lợi",
    description: "Cập nhật những tin tức mới nhất về ngành dầu nhớt, các sự kiện của Marshell và kiến thức kỹ thuật về bảo trì động cơ.",
    openGraph: {
        title: "Tin Tức & Sự Kiện - Marshell",
        description: "Cập nhật thông tin về sản phẩm, công nghệ và các hoạt động của Công ty TNHH Thành Lợi Marshell.",
        type: "website",
    }
}

export default function NewsPage() {
    return <NewsClientPage />
}
