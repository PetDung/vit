"use client"

import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/reveal"
import { Parallax } from "@/components/parallax"
import { type StatItem } from "@/lib/stats"
import Image from "next/image"

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number
  suffix: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const step = (timestamp: number) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / duration, 1)
            setDisplayValue(Math.floor(progress * value))
            if (progress < 1) {
              requestAnimationFrame(step)
            }
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  )
}

export function StatsSection({ initialData }: { initialData?: StatItem[] }) {
  const [stats, setStats] = useState<StatItem[]>(initialData || [])

  useEffect(() => {
    if (initialData && stats.length === 0) setStats(initialData)
  }, [initialData, stats.length])

  if (stats.length === 0) return null

  return (
    <section className="py-0 bg-primary relative overflow-hidden">
      {/* Industrial pattern & Backgrounds */}
      <div className="absolute inset-0 z-0">
        <Parallax offset={50} speed={0.4} className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
          <Image src="/bg/bg-2.jpg" alt="Industrial texture" fill sizes="100vw" className="object-cover -top-[10%]" />
        </Parallax>

        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, #000 100px, #000 101px)`
        }} />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`relative p-8 lg:p-12 text-center group hover:bg-primary-foreground/10 transition-colors ${index < stats.length - 1 ? "border-r border-primary-foreground/20" : ""
                }`}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-foreground/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-foreground/30" />

              <div className="text-xs font-bold text-primary-foreground/50 tracking-widest mb-2">
                {stat.icon}
              </div>

              <div className="text-4xl lg:text-6xl font-black text-primary-foreground tracking-tight">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <Reveal delay={200}>
                <p className="mt-3 text-sm font-bold uppercase tracking-wider text-primary-foreground/70">
                  {stat.label}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
