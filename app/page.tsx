import LandingPageClient from "./landing-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marshell - Giải Pháp Dầu Nhớt Công Nghiệp Toàn Diện",
  description:
    "Công ty TNHH Thành Lợi Marshell - Cung cấp dầu nhớt cơ khí và dầu bôi trơn máy CNC chất lượng cao. Chọn lĩnh vực bạn quan tâm.",
  openGraph: {
    title: "Marshell - Giải Pháp Dầu Nhớt Công Nghiệp Toàn Diện",
    description:
      "Công ty TNHH Thành Lợi Marshell - Cung cấp dầu nhớt cơ khí và dầu bôi trơn máy CNC chất lượng cao.",
    type: "website",
    url: "https://www.marshell.com.vn",
  },
}

export default function LandingPage() {
  return <LandingPageClient />
}
