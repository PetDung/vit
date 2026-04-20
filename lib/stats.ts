const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export interface StatItem {
  value: number
  suffix: string
  label: string
  icon: string
}

const DEFAULT_STATS: StatItem[] = [
  { value: 15, suffix: "+", label: "Năm kinh nghiệm", icon: "YRS" },
  { value: 500, suffix: "+", label: "Khách hàng tin dùng", icon: "KH" },
  { value: 100, suffix: "%", label: "Nguyên liệu nhập khẩu", icon: "NK" },
  { value: 24, suffix: "/7", label: "Hỗ trợ tư vấn", icon: "HRS" }
]

export async function fetchStats(): Promise<StatItem[]> {
  try {
    const res = await fetch(`${API}/stats`)
    if (!res.ok) return DEFAULT_STATS
    return res.json()
  } catch {
    return DEFAULT_STATS
  }
}
