import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Liên hệ | Marshell",
  description: "Liên hệ với Marshell để được tư vấn và nhận báo giá tốt nhất cho các sản phẩm dầu nhớt công nghiệp, mỡ bôi trơn.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
