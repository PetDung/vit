"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { Parallax } from "@/components/parallax"
import { type Partner } from "@/lib/partners"

export function PartnersSection({ initialData }: { initialData?: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialData || [])

  useEffect(() => {
    if (initialData && partners.length === 0) setPartners(initialData)
  }, [initialData, partners.length])

  if (partners.length === 0) return null

  return (
    <section className="py-24 bg-background border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Parallax offset={50} className="absolute inset-0 opacity-10 h-[120%] -top-[10%]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
                linear-gradient(to right, #FFD700 1px, transparent 1px),
                linear-gradient(to bottom, #FFD700 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </Parallax>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-[100px] bg-primary/30" />
          <Reveal>
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Đối tác tin cậy
            </span>
          </Reveal>
          <div className="h-px flex-1 max-w-[100px] bg-primary/30" />
        </div>
        <Reveal delay={200}>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground">
            Thương hiệu <span className="text-gold-gradient">đồng hành</span>
          </h2>
        </Reveal>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex w-max animate-marquee">
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="mx-8 lg:mx-12 group relative"
            >
              <div className="relative w-[180px] h-[100px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-4 flex items-center justify-center transition-all duration-300 group-hover:border-primary/50 group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                <div className="relative w-full h-full transition-all duration-300 group-hover:scale-105">
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    fill
                    sizes="180px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
