"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, ChevronDown, ArrowLeftRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { fetchProducts, toSlug } from "@/lib/products"
import { fetchCompany, type CompanyInfo } from "@/lib/company"
import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from "next/navigation"
import { getThemeFromPath, themedHref, THEMES, type ThemeId } from "@/lib/theme-config"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [productChildren, setProductChildren] = useState<{ name: string; href: string }[]>([])
  const [company, setCompany] = useState<CompanyInfo | null>(null)

  const pathname = usePathname()
  const theme = getThemeFromPath(pathname)
  const basePath = theme.basePath

  // Determine the "other" theme for the switch button
  const otherThemeId: ThemeId = theme.id === "co-khi" ? "cnc" : "co-khi"
  const otherTheme = THEMES[otherThemeId]

  const navigation = [
    { name: "Trang chủ", href: basePath },
    {
      name: "Sản phẩm",
      href: themedHref(basePath, "/san-pham"),
      children: productChildren,
    },
    { name: "Giới thiệu", href: themedHref(basePath, "/ve-chung-toi") },
    { name: "Kinh nghiệm", href: themedHref(basePath, "/kinh-nghiem") },
    { name: "Tin tức", href: themedHref(basePath, "/tin-tuc") },
    { name: "Liên hệ", href: themedHref(basePath, "/lien-he") },
  ]

  const isHome = pathname === basePath
  const isProductDetailPage = pathname.startsWith(themedHref(basePath, "/san-pham/"))
  const isTransparentHeader = isHome || isProductDetailPage

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
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
          setProductChildren(
            data.slice(0, 3).map(p => ({
              name: p.name,
              href: `${themedHref(basePath, "/san-pham")}/${toSlug(p.name, p.id)}`
            }))
          )
        }
      } catch (error) {
        console.error("Error fetching menu products:", error)
      }
    }

    fetchThemeProducts()

    fetchCompany().then(data => {
      setCompany(data)
    })
  }, [basePath, theme.id])

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath
    return pathname.startsWith(href)
  }

  // Primary color for hazard stripe
  const stripeColor = theme.id === "cnc" ? "#4A9EFF" : "#ffcb05"
  const glowColor = theme.id === "cnc" ? "rgba(74,158,255,0.5)" : "rgba(255,215,0,0.5)"

  return (
    <header className={cn(
      "inset-x-0 top-0 z-50 transition-all duration-300",
      isTransparentHeader ? "fixed" : "sticky",
      isScrolled ? "py-0" : "py-4"
    )}>
      {/* Hazard stripe top */}
      <div className={cn(
        "h-1 transition-opacity duration-300",
        isScrolled ? "opacity-100" : "opacity-0"
      )} style={{
        background: `repeating-linear-gradient(45deg, ${stripeColor}, ${stripeColor} 8px, #000 8px, #000 16px)`
      }} />

      <div className={cn(
        "transition-all duration-300 backdrop-blur-md",
        isScrolled
          ? "bg-black/90 border-b border-white/10 shadow-lg"
          : "bg-transparent border-transparent shadow-none"
      )}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Left navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:gap-x-8">
            {navigation.slice(0, 4).map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors relative",
                    isActive(item.href)
                      ? "text-primary"
                      : "text-secondary-foreground/80 hover:text-primary"
                  )}
                >
                  {item.name}
                  {"children" in item && item.children && item.children.length > 0 && <ChevronDown className="h-4 w-4" />}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
                {"children" in item && item.children && item.children.length > 0 && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-card border-2 border-border shadow-xl p-2 min-w-[180px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-none p-2.5 text-secondary-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Center logo */}
          <div className="flex justify-center">
            <Link href={basePath} className="-m-1.5 p-1.5 flex items-center gap-2">
              <div
                className="p-2 rounded-sm flex items-center justify-center w-[160px] h-[45px] overflow-hidden transition-colors"
                style={{
                  backgroundColor: company?.logoBg || (theme.id === "cnc" ? "#1a3050" : "#ffcb05"),
                  boxShadow: `0 0 15px ${glowColor}`
                }}
              >
                <Image
                  src="/logo.png"
                  alt={theme.logoAlt}
                  width={160}
                  height={45}
                  className="w-full h-full object-contain"
                  priority
                  unoptimized
                />
              </div>
            </Link>
          </div>

          {/* Right navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
            {navigation.slice(4).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-bold uppercase tracking-wider transition-colors relative",
                  isActive(item.href)
                    ? "text-primary"
                    : "text-secondary-foreground/80 hover:text-primary"
                )}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}

            {/* Theme switch button */}
            <Link
              href={otherTheme.basePath}
              className={cn(
                "flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-full border transition-all duration-300",
                theme.id === "cnc"
                  ? "border-[#FFD700]/30 text-[#FFD700]/80 hover:bg-[#FFD700]/10 hover:border-[#FFD700]/60"
                  : "border-[#4A9EFF]/30 text-[#4A9EFF]/80 hover:bg-[#4A9EFF]/10 hover:border-[#4A9EFF]/60"
              )}
            >
              <ArrowLeftRight className="h-3 w-3" />
              {otherTheme.name}
            </Link>

            <a
              href="tel:0912127535"
              onClick={() => sendGAEvent('event', 'click', { event_category: 'conversion', event_label: 'header_call' })}
              className="flex items-center gap-2 text-sm font-bold text-primary"
            >
              <Phone className="h-4 w-4" />
              0912127535
            </a>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? "fixed inset-0 z-50" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm border-l-2 border-border">
          <div className="flex items-center justify-between">
            <Link href={basePath} className="-m-1.5 p-1.5 flex items-center gap-2">
              <div
                className="p-1.5 rounded-sm flex items-center justify-center w-[120px] h-[32px] overflow-hidden transition-colors"
                style={{
                  backgroundColor: company?.logoBg || (theme.id === "cnc" ? "#1a3050" : "#ffcb05"),
                  boxShadow: `0 0 10px ${glowColor}`
                }}
              >
                <Image
                  src="/logo.png"
                  alt={theme.logoAlt}
                  width={120}
                  height={32}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-none p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Theme switch button in mobile */}
          <div className="mt-4 flex justify-center">
            <Link
              href={otherTheme.basePath}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-300",
                theme.id === "cnc"
                  ? "border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
                  : "border-[#4A9EFF]/30 text-[#4A9EFF] hover:bg-[#4A9EFF]/10"
              )}
            >
              <ArrowLeftRight className="h-4 w-4" />
              Chuyển sang {otherTheme.name}
            </Link>
          </div>

          <div className="mt-4 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "-mx-3 block px-3 py-3 text-base font-bold uppercase tracking-wide transition-colors",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {"children" in item && item.children && item.children.length > 0 && (
                      <div className="pl-4 border-l-2 border-primary ml-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="-mx-3 block px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
