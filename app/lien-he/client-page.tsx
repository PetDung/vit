"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Globe, Clock, Send, ChevronRight, MessageSquare, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchCompany, DEFAULT_COMPANY, type CompanyInfo } from "@/lib/company"
import { contactsApi } from "@/lib/api"
import { toast } from "sonner"
import { sendGAEvent } from '@next/third-parties/google';

export default function ContactClientPage() {
    const [company, setCompany] = useState<CompanyInfo>(DEFAULT_COMPANY)
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", message: "" })
    const [sent, setSent] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    useEffect(() => {
        fetchCompany().then(setCompany)
    }, [])

    const contactInfo = [
        { icon: MapPin, label: "Địa chỉ", value: company.address, href: null },
        { icon: Phone, label: "Điện thoại", value: company.phone, href: `tel:${company.phone.replace(/[.\s\/]/g, "").split("/")[0]}` },
        { icon: Phone, label: "Hotline", value: company.hotline, href: `tel:${company.hotline.replace(/[.\s]/g, "")}`, highlight: true },
        { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
        { icon: Globe, label: "Website", value: company.website, href: company.website },
        { icon: Clock, label: "Giờ làm việc", value: company.workingHours, href: null },
    ]

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        sendGAEvent('event', 'click_nut_lien_he_page', {value: 'page_lien_he'})

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
                event_label: 'contact_form_success'
            })

            setSent(true)
            toast.success("Đã gửi yêu cầu liên hệ thành công!")
            setFormData({ name: "", email: "", phone: "", address: "", message: "" })
            setTimeout(() => setSent(false), 4000)
        } catch (error) {
            console.error("API Call Error:", error)
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="bg-black text-white min-h-screen">
            {/* ═══ MAP ═══ */}
            <section className="relative h-[300px] lg:h-[400px] w-full overflow-hidden">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863!2d105.8342!3d21.0278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAyJzE1LjIiTiAxMDXCsDUwJzA2LjgiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black pointer-events-none" />
                {/* Location pin overlay */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs z-10"
                >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-white/70">Bắc Ninh, Việt Nam</span>
                </motion.div>
            </section>

            {/* ═══ HERO ═══ */}
            <section className="py-12 lg:py-20 relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-xs text-white/40 mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-primary font-semibold">Liên hệ</span>
                    </motion.div>

                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tight mb-4 leading-[1.2] py-2"
                        >
                            <span className="block pb-2">Liên hệ</span>
                            <span className="block shimmer-text pb-2">với chúng tôi</span>
                        </motion.h1>
                    </div>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-white/40 max-w-lg text-sm">
                        Hãy liên hệ để được tư vấn và báo giá sản phẩm phù hợp nhất.
                    </motion.p>
                </div>
            </section>

            {/* ═══ GLOWING DIVIDER ═══ */}
            <div className="relative h-px mx-auto max-w-7xl px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
            </div>

            {/* ═══ FORM + INFO ═══ */}
            <section className="py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

                        {/* ── LEFT: Contact Form ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-3"
                        >
                            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 lg:p-10 relative overflow-hidden">
                                {/* Ambient */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/[0.04] blur-[80px] pointer-events-none" />

                                <h2 className="text-lg font-black uppercase tracking-wide mb-8 flex items-center gap-3 relative">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                    </div>
                                    Gửi thông tin liên hệ
                                </h2>

                                {sent ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-16"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                                        </div>
                                        <p className="text-lg font-bold mb-1">Đã gửi thành công!</p>
                                        <p className="text-white/40 text-sm">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5 relative">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <FormField label="Họ tên" required placeholder="Nhập họ tên" value={formData.name} focused={focusedField === "name"}
                                                onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                                                onChange={(v) => setFormData({ ...formData, name: v })} />
                                            <FormField label="Email" type="email" placeholder="email@example.com" value={formData.email} focused={focusedField === "email"}
                                                onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                                                onChange={(v) => setFormData({ ...formData, email: v })} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <FormField label="Điện thoại" required type="tel" placeholder="0912.xxx.xxx" value={formData.phone} focused={focusedField === "phone"}
                                                onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                                                onChange={(v) => setFormData({ ...formData, phone: v })} />
                                            <FormField label="Địa chỉ" placeholder="Nhập địa chỉ" value={formData.address} focused={focusedField === "address"}
                                                onFocus={() => setFocusedField("address")} onBlur={() => setFocusedField(null)}
                                                onChange={(v) => setFormData({ ...formData, address: v })} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">
                                                Nội dung yêu cầu <span className="text-primary">*</span>
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onFocus={() => setFocusedField("message")}
                                                onBlur={() => setFocusedField(null)}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                                                placeholder="Nhập nội dung tin nhắn..."
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-8 py-3.5 rounded-xl bg-primary text-black font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70"
                                            >
                                                <Send className="w-4 h-4" />
                                                {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                                            </motion.button>
                                            <button
                                                type="reset"
                                                onClick={() => setFormData({ name: "", email: "", phone: "", address: "", message: "" })}
                                                className="px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/40 font-bold text-sm uppercase tracking-wider hover:bg-white/10 hover:text-white/60 transition-all"
                                            >
                                                Làm lại
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>

                        {/* ── RIGHT: Company Info ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-2"
                        >
                            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 lg:p-8 relative overflow-hidden">
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />

                                <div className="flex items-center gap-3 mb-8 relative">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary font-black text-lg">M</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-wide">Marshell</h2>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Thông tin liên hệ</p>
                                    </div>
                                </div>

                                <div className="space-y-4 relative">
                                    {contactInfo.map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.07, duration: 0.4 }}
                                            className="flex gap-3 group p-2 -mx-2 rounded-xl hover:bg-white/[0.03] transition-colors"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                                                <item.icon className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[9px] uppercase tracking-wider text-white/25 block mb-0.5">{item.label}</span>
                                                {item.href ? (
                                                    <a
                                                        href={item.href}
                                                        onClick={() => {
                                                            if (item.href.startsWith('tel:')) {
                                                                sendGAEvent('event', 'click', {
                                                                    event_category: 'conversion',
                                                                    event_label: `call_${item.label.toLowerCase()}`
                                                                });
                                                            }
                                                        }}
                                                        className={`text-sm leading-snug break-all ${item.highlight ? "text-primary font-bold" : "text-white/60 hover:text-primary"} transition-colors`}
                                                    >
                                                        {item.value}
                                                    </a>
                                                ) : (
                                                    <span className="text-sm text-white/60 leading-snug">{item.value}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="my-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                                {/* Quick contact CTA */}
                                <motion.a
                                    href="tel:0912127535"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center justify-center gap-4 py-5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all group"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-black animate-pulse" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] uppercase tracking-wider text-white/40 block">Gọi ngay — Miễn phí tư vấn</span>
                                        <span className="text-primary font-black text-xl">0912.127.535</span>
                                    </div>
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    )
}

function FormField({ label, required, type = "text", placeholder, value, focused, onFocus, onBlur, onChange }: {
    label: string; required?: boolean; type?: string; placeholder: string; value: string; focused: boolean;
    onFocus: () => void; onBlur: () => void; onChange: (v: string) => void
}) {
    return (
        <div>
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-2 block">
                {label} {required && <span className="text-primary">*</span>}
            </label>
            <input
                type={type}
                required={required}
                value={value}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none transition-all ${focused ? "border-primary/50 ring-1 ring-primary/20 shadow-lg shadow-primary/5" : "border-white/10"
                    }`}
                placeholder={placeholder}
            />
        </div>
    )
}
