import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Về chúng tôi | Marshell",
  description: "Trải qua hơn 15 năm kinh nghiệm, Marshell tự hào là đối tác tin cậy cung cấp các giải pháp dầu nhớt và bôi trơn công nghiệp hàng đầu.",
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
