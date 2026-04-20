const API = "http://180.93.52.142:3007"

export interface Settings {
  mapUrl: string
  facebook: string
  zalo: string
}

const DEFAULT_SETTINGS: Settings = {
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59587.97785449778!2d106.0517698!3d21.1780556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350a3536c10fa9%3A0x72706e93b32d95e2!2zQsaw4buDbmcgQsOtbmgsIFRQLiBCw6FjIG5pbmgsIELhuq9jIE5pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
  facebook: "https://facebook.com",
  zalo: "https://zalo.me"
}

export async function fetchSettings(): Promise<Settings> {
  try {
    const res = await fetch(`${API}/settings`)
    if (!res.ok) return DEFAULT_SETTINGS
    return res.json()
  } catch {
    return DEFAULT_SETTINGS
  }
}
