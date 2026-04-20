"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { fetchProducts, toSlug } from "@/lib/products"
import { fetchCompany, type CompanyInfo } from "@/lib/company"
import { sendGAEvent } from '@next/third-parties/google';

const baseNavigation = [
  { name: "Trang chủ", href: "/" },
  {
    name: "Sản phẩm",
    href: "/san-pham",
    children: [] as { name: string; href: string }[],
  },
  { name: "Giới thiệu", href: "/ve-chung-toi" },
  { name: "Kinh nghiệm", href: "/kinh-nghiem" },
  { name: "Tin tức", href: "/tin-tuc" },
  { name: "Liên hệ", href: "/lien-he" },
]

import { usePathname } from "next/navigation"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [navigation, setNavigation] = useState(baseNavigation)
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  
  const pathname = usePathname()
  const isHome = pathname === "/"
  // Determine if it's the product detail page to make the header overlay the hero
  const isProductDetailPage = pathname.startsWith("/san-pham/") && pathname !== "/san-pham"
  const isTransparentHeader = isHome || isProductDetailPage

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetchProducts().then(data => {
      if (data.length > 0) {
        setNavigation(prev => prev.map(item =>
          item.name === "Sản phẩm"
            ? { ...item, children: data.slice(0, 3).map(p => ({ name: p.name, href: `/san-pham/${toSlug(p.name, p.id)}` })) }
            : item
        ))
      }
    })
    
    fetchCompany().then(data => {
      setCompany(data)
    })
  }, [])

  return (
    <header className={cn(
      "inset-x-0 top-0 z-50 transition-all duration-300",
      isTransparentHeader ? "fixed" : "sticky",
      isScrolled ? "py-0" : "py-4"
    )}>
      {/* Hazard stripe top - only show when scrolled or always? Keep always for brand */}
      <div className={cn(
        "h-1 transition-opacity duration-300",
        isScrolled ? "opacity-100" : "opacity-0"
      )} style={{
        background: 'repeating-linear-gradient(45deg, #ffcb05, #ffcb05 8px, #000 8px, #000 16px)'
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
                    (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                      ? "text-primary"
                      : "text-secondary-foreground/80 hover:text-primary"
                  )}
                >
                  {item.name}
                  {item.children && <ChevronDown className="h-4 w-4" />}
                  {(item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)) && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
                {item.children && (
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
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div 
                className="p-2 rounded-sm shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center justify-center w-[160px] h-[45px] overflow-hidden transition-colors"
                style={{ backgroundColor: company?.logoBg || '#ffcb05' }}
              >
                <Image
                  src="/logo.png"
                  alt="Marshell Logo"
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
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-8">
            {navigation.slice(4).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-bold uppercase tracking-wider transition-colors relative",
                  pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-secondary-foreground/80 hover:text-primary"
                )}
              >
                {item.name}
                {pathname.startsWith(item.href) && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
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
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                 <div 
                   className="p-1.5 rounded-sm shadow-[0_0_10px_rgba(255,215,0,0.5)] flex items-center justify-center w-[120px] h-[32px] overflow-hidden transition-colors"
                   style={{ backgroundColor: company?.logoBg || '#ffcb05' }}
                 >
                    <Image
                      src="/logo.png"
                      alt="Marshell Logo"
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
          <div className="mt-4 flex justify-center">
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
                        (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-primary hover:text-primary-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
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
