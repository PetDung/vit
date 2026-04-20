export interface Product {
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

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

/* Generate an SEO-friendly slug: ten-id, e.g. "lesturbo-15w-40-lt-01" */
export function toSlug(name: string, id: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove Vietnamese diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${id}`;
}

/* Extract the product id from a slug (last segment after splitting by known ids) */
export function findBySlug(
  products: Product[],
  slug: string,
): Product | undefined {
  return (
    products.find((p) => toSlug(p.name, p.id) === slug) ||
    products.find((p) => slug.endsWith(p.id))
  );
}

/* Fetch products from json-server */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("API Error");
    return res.json();
  } catch {
    return [];
  }
}
