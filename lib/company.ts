export interface CompanyInfo {
  name: string
  slogan: string
  address: string
  phone: string
  hotline: string
  email: string
  website: string
  workingHours: string
  logoBg?: string
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

const DEFAULT_COMPANY: CompanyInfo = {
  name: "Marshell Vietnam",
  slogan: "Chúng tôi tin tưởng sẽ đáp ứng được tất cả các nhu cầu đa dạng về sản phẩm dầu mỡ nhờn, hóa chất của người tiêu dùng cũng như các ngành công nghiệp.",
  address: "27 Đường Lý Thánh Tông, Phường Tân Hồng, Thị Xã Từ Sơn, Tỉnh Bắc Ninh",
  phone: "0964.737.266 / 0971.868.571",
  hotline: "0912.127.535",
  email: "marshell@gmail.com",
  website: "http://marshell.vn",
  workingHours: "Thứ 2 – Thứ 7: 8:00 – 17:30",
  logoBg: "#ffcb05",
}

export async function fetchCompany(): Promise<CompanyInfo> {
  try {
    const res = await fetch(`${API}/company`, { cache: "no-store" })
    if (!res.ok) throw new Error("API Error")
    return res.json()
  } catch {
    return DEFAULT_COMPANY
  }
}

export { DEFAULT_COMPANY }
