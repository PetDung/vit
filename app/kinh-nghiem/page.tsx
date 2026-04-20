"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Eye, ArrowRight, ChevronRight, ImageIcon, Bookmark, Wrench, Droplets, BookOpen, Gauge } from "lucide-react"
import { fetchExperience, type ExperienceArticle } from "@/lib/experience"
import { toSlug } from "@/lib/utils"

const tipIcons = [Gauge, Wrench, Droplets, BookOpen]

/* ──────────────────────────────────────────── */
/*  PAGE                                        */
/* ──────────────────────────────────────────── */
export default function ExperiencePage() {
    const [articles, setArticles] = useState<ExperienceArticle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchExperience().then(data => { setArticles(data.filter(a => a.published !== false)); setLoading(false) })
    }, [])
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    if (loading || articles.length === 0) {
        return (
            <main ref={heroRef} className="bg-black text-white min-h-screen flex items-center justify-center">
                {loading ? (
                    <div className="animate-pulse text-white/30 text-sm font-bold uppercase tracking-widest">Đang tải...</div>
                ) : (
                    <div className="text-center">
                        <p className="text-white/30 text-lg font-bold mb-2">Chưa có bài viết nào</p>
                        <p className="text-white/15 text-sm">Vui lòng thêm bài viết trong trang quản lý.</p>
                    </div>
                )}
            </main>
        )
    }

    return (
        <main className="bg-black text-white min-h-screen">

            {/* ═══ CINEMATIC HERO ═══ */}
            <section ref={heroRef} className="relative py-24 lg:py-36 overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[150px]" />
                    <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[100px]" />
                </div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                <motion.div style={{ opacity: heroOpacity }} className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xs text-white/40 mb-10"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-primary font-semibold">Kinh nghiệm</span>
                    </motion.div>

                    <div className="flex items-start gap-6 lg:gap-10">
                        <div className="flex-1 overflow-hidden">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-5 leading-[1.2] py-2"
                            >
                                <span className="block pb-2">Kinh nghiệm</span>
                                <span className="block shimmer-text pb-2">& Mẹo hay</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/40 max-w-lg text-sm lg:text-base"
                            >
                                Chia sẻ kiến thức chuyên sâu về dầu nhớt, bảo trì động cơ và kinh nghiệm sử dụng sản phẩm hiệu quả.
                            </motion.p>
                        </div>
                        {/* Decorative icon grid */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="hidden lg:grid grid-cols-2 gap-3"
                        >
                            {[Gauge, Wrench, Droplets, BookOpen].map((Icon, i) => (
                                <div key={i} className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary/30" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* ═══ GLOWING DIVIDER ═══ */}
            <div className="relative h-px mx-auto max-w-7xl px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
            </div>

            {/* ═══ CONTENT ═══ */}
            <section className="py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

                        {/* ── MAIN ── */}
                        <div className="lg:col-span-2 space-y-5">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-white/25 text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
                            >
                                Tất cả bài viết
                            </motion.p>

                            {articles.map((article, i) => {
                                const TipIcon = tipIcons[i % tipIcons.length]
                                return (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <Link href={`/kinh-nghiem/${toSlug(article.title, article.id)}`} className="block group">
                                            <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden">
                                                {/* Background number */}
                                                <span className="absolute -top-4 -right-1 text-[80px] font-black text-white/[0.02] leading-none select-none group-hover:text-primary/[0.04] transition-colors">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>

                                                {/* Image */}
                                                <div className="relative w-full sm:w-52 lg:w-60 shrink-0 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden">
                                                    <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {/* Tip icon badge */}
                                                    <div className="absolute top-2.5 left-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/90 flex items-center justify-center shadow-lg">
                                                            <TipIcon className="w-4 h-4 text-black" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 flex flex-col justify-between py-1 relative">
                                                    <div>
                                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2.5 leading-snug">{article.title}</h3>
                                                        <div className="text-white/35 text-sm leading-relaxed line-clamp-2 prose prose-sm prose-invert prose-p:text-white/35 prose-strong:text-white/60 max-w-none" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                                                    </div>
                                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                                        <div className="flex items-center gap-4 text-white/20 text-[10px]">
                                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(article.views || 0).toLocaleString("en-US")}</span>
                                                        </div>
                                                        <span className="text-primary text-xs font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:gap-2 transition-all">
                                                            Xem thêm <ArrowRight className="w-3.5 h-3.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* ── SIDEBAR ── */}
                        <div className="space-y-8">

                            {/* Featured */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden"
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />
                                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-5 relative">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    Tin tức & Sự kiện
                                </h3>
                                <Link href={`/kinh-nghiem/${toSlug(articles[0].title, articles[0].id)}`} className="block group">
                                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-white/5">
                                        <Image src={articles[0].image} alt={articles[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h4 className="text-xs font-bold text-white/90 line-clamp-2">{articles[0].title}</h4>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>

                            {/* Popular Tips */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="rounded-2xl bg-white/[0.02] border border-white/10 p-6"
                            >
                                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-5">
                                    <Bookmark className="w-4 h-4 text-primary" />
                                    Bài viết phổ biến
                                </h3>
                                <div className="space-y-3">
                                    {articles.slice(0, 4).map((a, i) => (
                                        <Link key={a.id} href={`/kinh-nghiem/${toSlug(a.title, a.id)}`} className="flex gap-3 group items-start">
                                            <span className="text-primary/30 font-black text-lg leading-none w-6 shrink-0 group-hover:text-primary transition-colors">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{a.title}</h4>
                                                <span className="text-[10px] text-white/20 flex items-center gap-1 mt-1">
                                                    <Eye className="w-2.5 h-2.5" /> {a.views.toLocaleString("en-US")}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>


                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
