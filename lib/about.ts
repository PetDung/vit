import { Award, Users, Truck, Shield, HeadphonesIcon, Clock } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

// We map string icon names from db to lucide components
const IconMap: Record<string, any> = {
  Award,
  Users,
  Truck,
  Shield,
  HeadphonesIcon,
  Clock
}

export interface AboutFeature {
  text: string
  icon: string
}

export interface AboutStat {
  value: string
  label: string
}

export interface AboutConfig {
  title1: string
  title2: string
  description1: string
  description2: string
  features: AboutFeature[]
  stats: AboutStat[]
}

const DEFAULT_ABOUT: AboutConfig = {
  title1: "Đối tác tin cậy",
  title2: "trong ngành dầu nhớt",
  description1: "Công ty TNHH Thành Lợi Marshell được thành lập với sứ mệnh mang đến những sản phẩm dầu nhớt chất lượng cao nhất cho thị trường Việt Nam.",
  description2: "Với hơn 15 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng trăm doanh nghiệp vận tải, đội tàu và nhà máy sản xuất. Chúng tôi hợp tác chặt chẽ với các chuyên gia đầu ngành như Caspi Việt Nam để đảm bảo mỗi sản phẩm đều đạt tiêu chuẩn quốc tế.",
  features: [
    { text: "100% nguyên liệu nhập khẩu từ các thương hiệu uy tín", icon: "Award" },
    { text: "Đội ngũ chuyên gia tư vấn giàu kinh nghiệm", icon: "Users" },
    { text: "Hệ thống phân phối rộng khắp miền Bắc", icon: "Truck" },
    { text: "Cam kết chất lượng và giá cả cạnh tranh", icon: "Shield" },
    { text: "Hỗ trợ kỹ thuật và tư vấn 24/7", icon: "HeadphonesIcon" },
    { text: "Chế độ bảo hành và đổi trả linh hoạt", icon: "Clock" }
  ],
  stats: [
    { value: "15+", label: "Năm" },
    { value: "500+", label: "Khách hàng" },
    { value: "100%", label: "Cam kết" }
  ]
}

export async function fetchAbout(): Promise<AboutConfig> {
  try {
    const res = await fetch(`${API}/about`)
    if (!res.ok) return DEFAULT_ABOUT
    const data = await res.json()
    
    // Ensure all features have a valid string icon
    if (data.features) {
      data.features = data.features.map((f: any) => ({
        ...f,
        icon: typeof f.icon === "string" ? f.icon : "Award"
      }))
    }
    
    return data
  } catch {
    return DEFAULT_ABOUT
  }
}
