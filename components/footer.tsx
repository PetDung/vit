"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, ArrowRight, Facebook, Share2 } from "lucide-react"
import { fetchCompany, DEFAULT_COMPANY, type CompanyInfo } from "@/lib/company"
import { fetchSettings, type Settings } from "@/lib/settings"
import { fetchProducts, toSlug } from "@/lib/products"
import { useState, useEffect } from "react"
import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from "next/navigation"
import { getThemeFromPath, themedHref } from "@/lib/theme-config"

export function Footer() {
  const [company, setCompany] = useState<CompanyInfo>(DEFAULT_COMPANY)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [productLinks, setProductLinks] = useState<{ name: string; href: string }[]>([])

  const pathname = usePathname()
  const theme = getThemeFromPath(pathname)
  const basePath = theme.basePath

  const stripeColor = theme.id === "cnc" ? "#4A9EFF" : "#ffcb05"
  const stripePattern = `repeating-linear-gradient(45deg, ${stripeColor}, ${stripeColor} 10px, #000 10px, #000 20px)`
  const diagonalColor = theme.id === "cnc" ? "rgba(74,158,255,0.1)" : "rgba(255,215,0,0.1)"
  const glowColor = theme.id === "cnc" ? "rgba(74,158,255,0.5)" : "rgba(255,215,0,0.5)"

  const navigation = {
    company: [
      { name: "Giới thiệu", href: themedHref(basePath, "/ve-chung-toi") },
      { name: "Tin tức", href: themedHref(basePath, "/tin-tuc") },
      { name: "Kinh nghiệm", href: themedHref(basePath, "/kinh-nghiem") },
    ],
    support: [
      { name: "Liên hệ", href: themedHref(basePath, "/lien-he") },
      { name: "Chính sách bảo hành", href: themedHref(basePath, "/lien-he") },
      { name: "Câu hỏi thường gặp", href: themedHref(basePath, "/lien-he") },
      { name: "Hướng dẫn sử dụng", href: themedHref(basePath, "/kinh-nghiem") },
    ],
  }

  useEffect(() => {
    fetchCompany().then(setCompany)
    fetchSettings().then(setSettings)
    
    const fetchThemeProducts = async () => {
      try {
        let data = []
        if (theme.id === "cnc") {
          const { fetchCnc } = await import("@/lib/cnc")
          data = await fetchCnc()
        } else {
          data = await fetchProducts()
        }
        
        if (data.length > 0) {
          setProductLinks(
            data.slice(0, 3).map(p => ({ 
              name: p.name, 
              href: `${themedHref(basePath, "/san-pham")}/${toSlug(p.name, p.id)}` 
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching footer products:", error)
      }
    }
    
    fetchThemeProducts()
  }, [basePath, theme.id])

  return (
    <footer className="bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="h-2" style={{ background: stripePattern }} />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `
            repeating-linear-gradient(
              -45deg,
              ${diagonalColor},
              ${diagonalColor} 1px,
              transparent 1px,
              transparent 20px
            )
          `
        }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href={basePath} className="inline-block">
              <div
                className="p-3 rounded-sm shadow-md inline-block w-[180px] h-[55px] overflow-hidden transition-colors"
                style={{
                  backgroundColor: company.logoBg || (theme.id === "cnc" ? "#1a3050" : "#ffcb05"),
                  boxShadow: `0 0 10px ${glowColor}`
                }}
              >
                <Image
                  src="/logo.png"
                  alt={theme.logoAlt}
                  width={180}
                  height={55}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </Link>
            <p className="mt-4 text-sm text-secondary-foreground/70 max-w-xs leading-relaxed">
              {company.slogan}
            </p>

            <div className="mt-6 space-y-3">
              <a
                href={`tel:${company.phone.replace(/[.\s\/]/g, "").split("/")[0]}`}
                onClick={() => sendGAEvent('event', 'click', { event_category: 'conversion', event_label: 'footer_call' })}
                className="flex items-center gap-3 text-sm text-secondary-foreground/70 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">{company.phone}</span>
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 text-sm text-secondary-foreground/70 hover:text-primary transition-colors group"
              >
                <div className="w-8 h-8 bg-primary flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary-foreground" />
                </div>
                <span>{company.email}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/70">
                <div className="w-8 h-8 bg-primary flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <span>{company.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">
              Sản phẩm
            </h3>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">
              Công ty
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/50">
              &copy; {new Date().getFullYear()} {company.name}.
              Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  onClick={() => sendGAEvent('event', 'view_facebook', { event_label: 'footer_facebook' })}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm flex items-center gap-1 text-secondary-foreground/50 hover:text-primary transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              )}
              {settings?.zalo && (
                <a
                  href={settings.zalo}
                  onClick={() => sendGAEvent('event', 'view_zalo', { event_label: 'footer_zalo' })}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm flex items-center gap-1 text-secondary-foreground/50 hover:text-primary transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Zalo
                </a>
              )}
              <Link
                href="#"
                className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="#"
                className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
