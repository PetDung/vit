import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện | Marshell",
  description: "Cập nhật các thông tin mới nhất về sản phẩm, doanh nghiệp và các sự kiện nổi bật của Marshell Việt Nam.",
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
