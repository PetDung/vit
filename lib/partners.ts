const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export interface Partner {
  name: string
  src: string
}

const DEFAULT_PARTNERS: Partner[] = [
  { name: "Brenntag", src: "/doi-tac/1952brenntag-logo.png" },
  { name: "Capi", src: "/doi-tac/2140capi-logo.png" }
]

export async function fetchPartners(): Promise<Partner[]> {
  try {
    const res = await fetch(`${API}/partners`)
    if (!res.ok) return DEFAULT_PARTNERS
    return res.json()
  } catch {
    return DEFAULT_PARTNERS
  }
}
