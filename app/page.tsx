import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"
import { Metadata } from "next";

import { fetchHero } from "@/lib/hero"
import { fetchStats } from "@/lib/stats"
import { fetchProducts } from "@/lib/products"
import { fetchAbout } from "@/lib/about"
import { fetchPartners } from "@/lib/partners"
import { fetchCompany } from "@/lib/company"
import { fetchSettings } from "@/lib/settings"

export const metadata: Metadata = {
  title: "Marshell - Dầu Nhớt Công Nghiệp Chất Lượng Cao",
  description:
    "Công ty TNHH Thành Lợi Marshell - 15 năm kinh nghiệm cung cấp dầu nhớt, dầu thủy lực chất lượng cao cho động cơ Diesel, xe tải, tàu thuyền tại Việt Nam.",
  openGraph: {
    title: "Marshell - Dầu Nhớt Công Nghiệp Chất Lượng Cao",
    description:
      "Công ty TNHH Thành Lợi Marshell - 15 năm kinh nghiệm cung cấp dầu nhớt, dầu thủy lực chất lượng cao cho động cơ Diesel, xe tải, tàu thuyền tại Việt Nam.",
    type: "website",
    url: "https://www.marshell.com.vn",
    images: [
      {
        url: "https://www.marshell.com.vn/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marshell - Dầu Nhớt Công Nghiệp Chất Lượng Cao",
      },
    ],
  },
};

export default async function Home() {
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
