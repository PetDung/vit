import type { Metadata } from 'next'
import { HeroSection } from "@/components/hero-section"

export const metadata: Metadata = {
  title: 'Dầu Nhớt Công Nghiệp Marshell - 15 Năm Kinh Nghiệm',
  description: 'Chuyên cung cấp dầu nhớt động cơ Diesel, dầu thủy lực, dầu bánh răng cho xe tải, tàu thuyền và máy móc công nghiệp nặng.',
}
import { StatsSection } from "@/components/stats-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"

import { fetchHero } from "@/lib/hero"
import { fetchStats } from "@/lib/stats"
import { fetchProducts } from "@/lib/products"
import { fetchAbout } from "@/lib/about"
import { fetchPartners } from "@/lib/partners"
import { fetchCompany } from "@/lib/company"
import { fetchSettings } from "@/lib/settings"

export default async function CoKhiHome() {
  const [heroData, statsData, productsData, aboutData, partnersData, companyData, settingsData] = await Promise.all([
    fetchHero(),
    fetchStats(),
    fetchProducts(),
    fetchAbout(),
    fetchPartners(),
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
