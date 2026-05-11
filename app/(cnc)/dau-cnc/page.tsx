import type { Metadata } from 'next'
import { HeroSection } from "@/components/hero-section"

export const metadata: Metadata = {
  title: 'Dầu Máy CNC Chính Hãng - Giải Pháp Bôi Trơn Chuyên Dụng',
  description: 'Cung cấp các loại dầu máy CNC, dầu cắt gọt kim loại, dầu bôi trơn đường trượt và dầu thủy lực chuyên dụng cho trung tâm gia công CNC.',
}
import { StatsSection } from "@/components/stats-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"

import { fetchCompany } from "@/lib/company"
import { fetchSettings } from "@/lib/settings"

import { API_URL as API } from "@/lib/config"

async function fetchCncHero() {
  try {
    const res = await fetch(`${API}/cncHero`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchCncStats() {
  try {
    const res = await fetch(`${API}/cncStats`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function fetchCncProducts() {
  try {
    const res = await fetch(`${API}/cnc`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function fetchCncAbout() {
  try {
    const res = await fetch(`${API}/cncAbout`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchCncPartners() {
  try {
    const res = await fetch(`${API}/cncPartners`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function CncHome() {
  const [heroData, statsData, productsData, aboutData, partnersData, companyData, settingsData] = await Promise.all([
    fetchCncHero(),
    fetchCncStats(),
    fetchCncProducts(),
    fetchCncAbout(),
    fetchCncPartners(),
    fetchCompany(),
    fetchSettings()
  ])

  return (
    <main className="min-h-screen bg-background">
      <HeroSection initialData={heroData} />
      <StatsSection initialData={statsData} />
      <ProductsSection initialData={productsData} />
      <AboutSection initialData={aboutData} />
      <PartnersSection initialData={partnersData} />
      <ContactSection initialCompany={companyData} initialSettings={settingsData} />
    </main>
  )
}
