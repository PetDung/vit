"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Parallax } from "@/components/parallax"

import { toSlug, type Product } from "@/lib/products"

import Link from "next/link"
import { Reveal } from "./reveal"
import { sendGAEvent } from '@next/third-parties/google';

export function ProductsSection({ initialData }: { initialData: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialData)

  useEffect(() => {
    if (initialData && products.length === 0) setProducts(initialData)
  }, [initialData, products.length])

  return (
    <section id="san-pham" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Parallax offset={150} className="absolute inset-0 opacity-10 h-[120%] -top-[10%]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </Parallax>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-bold tracking-widest uppercase text-sm">
                Sản phẩm nổi bật
              </span>
            </div>
            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground uppercase">
                Giải pháp bôi trơn
                <br />
                <span className="text-primary">toàn diện</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={200} className="lg:text-right">
            <Link href="/san-pham">
              <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-wide">
                Xem toàn bộ danh mục <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Reveal>
        </div>

        {/* Products grid (Preview only 3 items) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product, index) => (
            <article
              key={product.id}
              className="group relative bg-card border-2 border-border overflow-hidden hover:border-primary transition-all duration-300"
            >
              {/* Product number */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-xs font-mono font-bold text-muted-foreground/50 bg-background/80 px-2 py-1">
                  {product.code}
                </span>
              </div>

              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                <Parallax offset={20} speed={0.2} className="w-full h-[120%] -top-[10%] relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-6 border-t-4 border-primary relative z-20 bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center shadow-lg">
                    {product.icon && <product.icon className="h-5 w-5 text-primary-foreground" />}
                  </div>
                  <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {typeof product.description === 'string' && product.description.startsWith('<')
                    ? product.description.replace(/<[^>]*>/g, '').slice(0, 100)
                    : product.description}
                </p>
                <Link 
                  href={`/san-pham/${toSlug(product.name, product.id)}`}
                  onClick={() => sendGAEvent('event', 'click', { 
                    event_category: 'engagement', 
                    event_label: `home_to_product_${product.name}` 
                  })}
                >
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-foreground hover:text-primary gap-2 font-bold uppercase tracking-wide group/btn"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Index number */}
              <div className="absolute -bottom-8 -right-4 pointer-events-none overflow-hidden">
                <Parallax offset={-30} speed={0.3}>
                  <span className="text-[120px] font-black text-muted/10 leading-none select-none block">
                    0{index + 1}
                  </span>
                </Parallax>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
