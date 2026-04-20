export interface CncProduct {
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

import { toSlug } from '@/lib/utils'

export function findCncBySlug(items: CncProduct[], slug: string): CncProduct | undefined {
  return items.find((p) => toSlug(p.name, p.id) === slug) || items.find((p) => slug.endsWith(p.id));
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"

export async function fetchCnc(): Promise<CncProduct[]> {
  try {
    const res = await fetch(`${API}/cnc`, { cache: "no-store" })
    if (!res.ok) throw new Error("API Error")
    return res.json()
  } catch {
    return []
  }
}
