"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Parallax } from "@/components/parallax"
import { DEFAULT_COMPANY, type CompanyInfo } from "@/lib/company"
import { type Settings } from "@/lib/settings"
import { contactsApi } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image"
import { sendGAEvent } from '@next/third-parties/google';

export function ContactSection({ initialCompany, initialSettings }: { initialCompany?: CompanyInfo, initialSettings?: Settings | null }) {
  const [company, setCompany] = useState<CompanyInfo>(initialCompany || DEFAULT_COMPANY)
  const [settings, setSettings] = useState<Settings | null>(initialSettings || null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialCompany && company === DEFAULT_COMPANY) setCompany(initialCompany)
    if (initialSettings && !settings) setSettings(initialSettings)
  }, [initialCompany, initialSettings, company, settings])

  const contactInfo = [
    { icon: MapPin, label: "Địa chỉ", value: company.address },
    { icon: Phone, label: "Điện thoại", value: company.phone },
    { icon: Mail, label: "Email", value: company.email },
    { icon: Clock, label: "Giờ làm việc", value: company.workingHours },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 📊 TRACK CLICK
    sendGAEvent('event', 'click_nut_lien_he', { source: 'home_contact_section' })

    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc")
      return
    }

    setIsSubmitting(true)
    try {
      await contactsApi.create({
        ...formData,
        id: `contact-${Date.now()}`,
        date: new Date().toISOString(),
        isCared: false,
        note: ""
      })
      
      // 🌟 TRACK SUCCESSFUL LEAD
      sendGAEvent('event', 'generate_lead', { 
        event_category: 'conversion',
        event_label: 'home_contact_success'
      })

      toast.success("Đã gửi yêu cầu tư vấn thành công!")
      setFormData({ name: "", phone: "", email: "", address: "", message: "" })
    } catch (error) {
      console.error("API Call Error:", error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fallback map URL
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59587.97785449778!2d106.0517698!3d21.1780556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31350a3536c10fa9%3A0x72706e93b32d95e2!2zQsaw4buDbmcgQsOtbmgsIFRQLiBCw6FjIG5pbmgsIELhuq9jIE5pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"

  return (
    <section id="lien-he" className="py-24 lg:py-32 bg-muted relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Parallax offset={100} speed={0.3} className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none h-[120%] -top-[10%]">
          <Image src="/bg/bg-2.jpg" alt="" fill sizes="100vw" className="object-cover grayscale" />
        </Parallax>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              Liên hệ
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground uppercase">
            Hãy để chúng tôi
            <br />
            <span className="text-gold-gradient">tư vấn cho bạn</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="p-6 bg-card border-2 border-border hover:border-primary transition-all duration-300 group gold-glow"
                >
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                    <info.icon className="h-5 w-5 text-secondary-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {info.label}
                  </p>
                  <p className="font-bold text-foreground">{info.value}</p>
                </div>
              ))}
            </div>

            <div className="h-64 bg-card border-2 border-border overflow-hidden relative gold-glow transition-all duration-300">
              <iframe
                src={settings?.mapUrl || defaultMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-secondary/90 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary-foreground">
                  {company.address}
                </span>
              </div>
            </div>
          </div>

          <div className="relative animate-in slide-in-from-right duration-700 fade-in">
            <div className="absolute -top-2 left-0 right-0 h-1 bg-primary" />

            <div className="bg-card border-2 border-border p-8 shadow-2xl">
              <h3 className="text-xl font-black text-foreground mb-6 uppercase tracking-wide flex items-center gap-3">
                <Send className="h-5 w-5 text-primary" />
                Gửi yêu cầu tư vấn
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Họ và tên *
                  </label>
                  <Input
                    id="name"
                    required
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-none border-2 focus:border-primary h-12 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Số điện thoại *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="0xxx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-none border-2 focus:border-primary h-12 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-none border-2 focus:border-primary h-12 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Địa chỉ
                  </label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Nhập địa chỉ"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="rounded-none border-2 focus:border-primary h-12 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Nội dung *
                  </label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Mô tả nhu cầu của bạn..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-none border-2 focus:border-primary resize-none transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full animate-shimmer text-black font-black uppercase tracking-wider h-14 rounded-none shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:-translate-y-0"
                  size="lg"
                >
                  {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                  {!isSubmitting && <Send className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
