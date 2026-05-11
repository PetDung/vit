import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marshell - Dầu Bôi Trơn Máy CNC Chuyên Dụng",
  description:
    "Marshell cung cấp dầu bôi trơn chuyên dụng cho máy CNC, dầu cắt gọt, dầu thủy lực CNC chất lượng cao. Giải pháp bôi trơn tối ưu cho ngành gia công cơ khí chính xác.",
};

export default function CncLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
