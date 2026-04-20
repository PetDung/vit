export interface DauMayProduct {
  id: string;
  code?: string;
  name: string;
  category?: string;
  description: string;
  content?: string;
  performance?: {
    protection: number;
    life: number;
    temperature: number;
    efficiency: number;
    cleanliness: number;
  };
  image: string;
  images?: string[];
  imageUrl: string;
  icon?: any;
  featured?: boolean;
  techSpecUrl?: string;
}

export function toSlug(name: string, id: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${id}`;
}

export function findDauMayBySlug(items: DauMayProduct[], slug: string): DauMayProduct | undefined {
  return items.find((p) => toSlug(p.name, p.id) === slug) || items.find((p) => slug.endsWith(p.id));
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export async function fetchDauMay(): Promise<DauMayProduct[]> {
  try {
    const res = await fetch(`${API}/dauMay`, { cache: "no-store" })
    if (!res.ok) throw new Error("API Error")
    return res.json()
  } catch {
    return []
  }
}
