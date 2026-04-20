import { Metadata } from "next"
import ContactClientPage from "./client-page"

export const metadata: Metadata = {
    title: "Liên Hệ - Marshell | Tư Vấn Thiết Kế Bảng Biểu Cao Cấp",
    description: "Liên hệ với Marshell để được tư vấn các giải pháp thiết kế thi công bảng quảng cáo, màn hình LED, và nội thất cao cấp. Nhận báo giá ngay.",
    openGraph: {
        title: "Liên Hệ - Marshell",
        description: "Liên hệ thông qua điện thoại, email hoặc để lại thông tin trên form để được hỗ trợ nhanh nhất.",
        type: "website",
    }
}

export default function ContactPage() {
    return <ContactClientPage />
}
