"use client"

import { useState, useEffect } from "react"
import { Reveal } from "@/components/reveal"
import { Award, Truck, HeadphonesIcon, Shield, Clock, Users } from "lucide-react"
import { Parallax } from "@/components/parallax"
import { type AboutConfig } from "@/lib/about"
import Image from "next/image"

const DEFAULT_FEATURES = [
  { text: "100% nguyên liệu nhập khẩu từ các thương hiệu uy tín", icon: "Award" },
  { text: "Đội ngũ chuyên gia tư vấn giàu kinh nghiệm", icon: "Users" },
  { text: "Hệ thống phân phối rộng khắp miền Bắc", icon: "Truck" },
  { text: "Cam kết chất lượng và giá cả cạnh tranh", icon: "Shield" },
  { text: "Hỗ trợ kỹ thuật và tư vấn 24/7", icon: "HeadphonesIcon" },
  { text: "Chế độ bảo hành và đổi trả linh hoạt", icon: "Clock" },
]

const IconMap: Record<string, any> = {
  Award,
  Users,
  Truck,
  Shield,
  HeadphonesIcon,
  Clock
}

export function AboutSection({ initialData }: { initialData?: AboutConfig | null }) {
  const [config, setConfig] = useState<AboutConfig | null>(initialData || null)

  useEffect(() => {
    if (initialData && !config) setConfig(initialData)
  }, [initialData, config])

  const title1 = config?.title1 || "Đối tác tin cậy"
  const title2 = config?.title2 || "trong ngành dầu nhớt"
  const desc1 = config?.description1 || "Công ty TNHH Thành Lợi Marshell được thành lập với sứ mệnh mang đến những sản phẩm dầu nhớt chất lượng cao nhất cho thị trường Việt Nam."
  const desc2 = config?.description2 || "Với hơn 15 năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng trăm doanh nghiệp vận tải, đội tàu và nhà máy sản xuất. Chúng tôi hợp tác chặt chẽ với các chuyên gia đầu ngành như Caspi Việt Nam để đảm bảo mỗi sản phẩm đều đạt tiêu chuẩn quốc tế."

  const stats = config?.stats || [
    { value: "15+", label: "Năm" },
    { value: "500+", label: "Khách hàng" },
    { value: "100%", label: "Cam kết" }
  ]

  const features = config?.features || DEFAULT_FEATURES

  return (
    <section id="gioi-thieu" className="py-24 lg:py-32 bg-secondary text-secondary-foreground relative overflow-hidden">
      <Parallax offset={150} speed={0.6} className="absolute top-0 right-0 w-full lg:w-1/2 h-[120%] -top-[10%] opacity-20 pointer-events-none mix-blend-screen">
        <Image src="/bg/bg-3.png" alt="" fill sizes="100vw" className="object-cover" />
      </Parallax>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary font-bold tracking-widest uppercase text-sm">
                Về chúng tôi
              </span>
            </div>

            <Reveal>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-secondary-foreground uppercase leading-tight">
                {title1}
                <br />
                <span className="text-primary">{title2}</span>
              </h2>
            </Reveal>

            <div className="mt-8 space-y-6">
              <Reveal delay={200}>
                <p className="text-lg text-secondary-foreground/80 leading-relaxed">
                  {desc1}
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="text-secondary-foreground/60 leading-relaxed">
                  {desc2}
                </p>
              </Reveal>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-4">
                  <div className="text-3xl font-black text-primary">{stat.value}</div>
                  <div className="text-sm text-secondary-foreground/60 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -left-4 right-4 h-2" style={{
              background: "repeating-linear-gradient(45deg, #ffcb05, #ffcb05 10px, #000 10px, #000 20px)"
            }} />

            <div className="bg-primary p-8 lg:p-10 relative">
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary-foreground/30" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary-foreground/30" />

              <h3 className="text-xl font-black text-primary-foreground mb-8 uppercase tracking-wide">
                Tại sao chọn Marshell?
              </h3>
              <ul className="space-y-5">
                {features.map((feature, idx) => {
                  const IconComponent = IconMap[feature.icon] || Award;
                  return (
                    <li key={idx} className="flex items-start gap-4 group">
                      <div className="w-8 h-8 bg-primary-foreground flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors">
                        <IconComponent className="h-4 w-4 text-primary group-hover:text-primary" />
                      </div>
                      <span className="text-primary-foreground/90 leading-relaxed">{feature.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
