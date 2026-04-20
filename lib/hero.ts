const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export interface HeroConfig {
  title1: string
  title2: string
  title3: string
  experience: string
  description: string
  videoUrl: string
}

const DEFAULT_HERO: HeroConfig = {
  title1: "Dầu nhớt",
  title2: "Công nghiệp",
  title3: "Chất lượng cao",
  experience: "+ 15 Năm Kinh Nghiệm",
  description: "Đối tác tin cậy cung cấp giải pháp bôi trơn toàn diện cho động cơ Diesel, xe tải và tàu thuyền tại Miền Bắc.",
  videoUrl: "/input.mp4"
}

export async function fetchHero(): Promise<HeroConfig> {
  try {
    const res = await fetch(`${API}/hero`)
    if (!res.ok) return DEFAULT_HERO
    return res.json()
  } catch {
    return DEFAULT_HERO
  }
}
