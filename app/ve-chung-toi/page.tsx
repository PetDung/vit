import { Metadata } from "next"
import AboutClientPage from "./client-page"

export const metadata: Metadata = {
    title: "Về Chúng Tôi - Marshell | Uy tín & Chất lượng",
    description: "Khám phá câu chuyện hình thành và phát triển của Marshell. Nhờ kinh nghiệm làm việc với các tập đoàn đa quốc gia, chúng tôi mang đến giá trị thực cho khách hàng.",
    openGraph: {
        title: "Về Chúng Tôi - Marshell",
        description: "Từ kinh nghiệm quốc tế đến thương hiệu Việt, Marshell cam kết các sản phẩm chất lượng tiêu chuẩn ISO, API, CK-4.",
        type: "website",
    }
}

export default function AboutPage() {
    return <AboutClientPage />
}
