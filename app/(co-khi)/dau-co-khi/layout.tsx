import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marshell - Dầu Nhớt Cơ Khí Công Nghiệp Chất Lượng Cao",
  description:
    "Công ty TNHH Thành Lợi Marshell - 15 năm kinh nghiệm cung cấp dầu nhớt, dầu thủy lực chất lượng cao cho động cơ Diesel, xe tải, tàu thuyền tại Việt Nam.",
};

export default function CoKhiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
