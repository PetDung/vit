"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Eye, ArrowRight, Tag, ImageIcon, ChevronRight, TrendingUp } from "lucide-react"
import { fetchNews, type NewsArticle } from "@/lib/news"
import { newsCategoryApi } from "@/lib/api"
import { toSlug } from "@/lib/utils"

export default function NewsClientPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([fetchNews(), newsCategoryApi.getAll().catch(() => [])]).then(([news, cats]) => {
            setArticles(news.filter(n => n.published !== false))
            setCategories(cats)
            setLoading(false)
        })
    }, [])

    const featuredArticle = articles[0]
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
                {/* Animated background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px]" />
                </div>
                {/* Grain */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                <motion.div style={{ opacity: heroOpacity }} className="mx-auto max-w-7xl px-6 lg:px-8 relative">
                    {/* Breadcrumb */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-xs text-white/40 mb-10"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-primary font-semibold">Tin tức</span>
                    </motion.div>

                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight mb-5 leading-[1.2] py-2"
                        >
                            <span className="block pb-2">Tin tức</span>
                            <span className="block shimmer-text pb-2">& Sự kiện</span>
                        </motion.h1>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/40 max-w-lg text-sm lg:text-base"
                    >
                        Cập nhật thông tin mới nhất về sản phẩm, công nghệ và hoạt động của Marshell.
                    </motion.p>
                </motion.div>
            </section>

            {/* ═══ FEATURED ARTICLE ═══ */}
            <section className="pb-16 lg:pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link href={`/tin-tuc/${toSlug(featuredArticle.title, featuredArticle.id)}`} className="block group">
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-primary/20 transition-all duration-500">
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                    <div className="relative aspect-[16/10] lg:aspect-[4/3]">
                                        <Image
                                            src={featuredArticle.image}
                                            alt={featuredArticle.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-black/60" />
                                        <div className="absolute top-5 left-5">
                                            <span className="px-4 py-1.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                                <TrendingUp className="w-3 h-3" /> Nổi bật
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                                        {/* Background number */}
                                        <span className="absolute top-4 right-6 text-[120px] font-black text-white/[0.02] leading-none select-none">01</span>
                                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">{featuredArticle.category}</span>
                                        <h2 className="text-2xl lg:text-4xl font-black uppercase mb-5 group-hover:text-primary transition-colors leading-[1.4] py-1">
                                            {featuredArticle.title}
                                        </h2>
                                        <div className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-3 prose prose-sm prose-invert prose-p:text-white/40 prose-strong:text-white/60 max-w-none" dangerouslySetInnerHTML={{ __html: featuredArticle.excerpt }} />
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-white/25 text-xs">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{featuredArticle.date}</span>
                                                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{(featuredArticle.views || 0).toLocaleString("en-US")}</span>
                                            </div>
                                            <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Đọc thêm <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ═══ GLOWING DIVIDER ═══ */}
            <div className="relative h-px mx-auto max-w-7xl px-6 lg:px-8">
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
            </div>

            {/* ═══ CONTENT: Articles + Sidebar ═══ */}
            <section className="py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

                        {/* ── MAIN: Article List ── */}
                        <div className="lg:col-span-2 space-y-5">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-white/25 text-[10px] font-bold uppercase tracking-[0.3em] mb-4"
                            >
                                Tất cả bài viết
                            </motion.p>

                            {articles.slice(1).map((article, i) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link href={`/tin-tuc/${toSlug(article.title, article.id)}`} className="block group">
                                        <div className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300">
                                            {/* Image */}
                                            <div className="relative w-full sm:w-52 lg:w-60 shrink-0 aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden">
                                                <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute top-2.5 left-2.5">
                                                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-primary text-[9px] font-bold uppercase border border-white/10">{article.category}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2.5 leading-snug">{article.title}</h3>
                                                    <div className="text-white/35 text-sm leading-relaxed line-clamp-2 prose prose-sm prose-invert prose-p:text-white/35 prose-strong:text-white/60 max-w-none" dangerouslySetInnerHTML={{ __html: article.excerpt }} />
                                                </div>
                                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                                    <div className="flex items-center gap-4 text-white/20 text-[10px]">
                                                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{article.date}</span>
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
                            ))}
                        </div>

                        {/* ── SIDEBAR ── */}
                        <div className="space-y-8">

                            {/* Categories */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 relative overflow-hidden"
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />
                                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-5 relative">
                                    <Tag className="w-4 h-4 text-primary" />
                                    Danh mục tin tức
                                </h3>
                                <ul className="space-y-1 relative">
                                    {categories.map((cat) => (
                                        <li key={cat.name}>
                                            <Link href="/tin-tuc" className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all text-sm group">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                                    <span>{cat.name}</span>
                                                </div>
                                                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/30 group-hover:bg-primary/20 group-hover:text-primary transition-colors font-bold">
                                                    {cat.count}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Featured News */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="rounded-2xl bg-white/[0.02] border border-white/10 p-6"
                            >
                                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-5">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    Tin tức nổi bật
                                </h3>
                                <div className="space-y-4">
                                    {articles.filter(a => a.featured).map((a) => (
                                        <Link key={a.id} href={`/tin-tuc/${toSlug(a.title, a.id)}`} className="flex gap-3 group">
                                            <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                                <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{a.title}</h4>
                                                <span className="text-[10px] text-white/25 mt-1 flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{a.date}</span>
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
