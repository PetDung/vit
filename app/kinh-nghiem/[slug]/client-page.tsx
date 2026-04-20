"use client"
 
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Eye, ChevronRight, ArrowLeft, Share2, Lightbulb } from "lucide-react"
import { type ExperienceArticle } from "@/lib/experience"
import { toSlug } from "@/lib/utils"
 
export default function ExperienceDetailClientPage({ article, related }: { article: ExperienceArticle, related: ExperienceArticle[] }) {
    return (
        <main className="bg-black text-white min-h-screen">
 
            {/* ═══ HERO IMAGE ═══ */}
            <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
 
                <div className="absolute inset-0 flex items-end">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full pb-10 lg:pb-14">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-xs text-white/50 mb-5"
                        >
                            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link href="/kinh-nghiem" className="hover:text-primary transition-colors">Kinh nghiệm</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-primary/80 truncate max-w-[200px]">{article.title}</span>
                        </motion.div>
 
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider mb-4"
                        >
                            <Lightbulb className="w-3 h-3" />
                            Kinh nghiệm
                        </motion.span>
 
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tight leading-[1.2] max-w-4xl py-2"
                            >
                                {article.title}
                            </motion.h1>
                        </div>
 
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-5 mt-5 text-white/40 text-xs"
                        >
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
                            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{(article.views || 0).toLocaleString("en-US")} lượt xem</span>
                        </motion.div>
                    </div>
                </div>
            </section>
 
            {/* ═══ ARTICLE CONTENT ═══ */}
            <section className="py-12 lg:py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-14">
 
                        <motion.article
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="lg:col-span-3"
                        >
                            {/* Excerpt */}
                            <div
                                className="text-lg lg:text-xl text-white/60 leading-relaxed mb-8 pb-8 border-b border-white/10 prose prose-invert prose-lg prose-p:text-white/60 prose-strong:text-white/80 max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.excerpt }}
                            />
 
                            {/* Full content */}
                            <div
                                className="prose prose-invert max-w-none
                  prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-white
                  prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-white/90
                  prose-p:text-white/50 prose-p:leading-relaxed
                  prose-strong:text-primary prose-strong:font-bold
                  prose-ul:text-white/50 prose-ol:text-white/50
                  prose-li:marker:text-primary/50
                  prose-blockquote:border-primary/30 prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
                  prose-blockquote:text-white/60
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
 
                            <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                                <Link href="/kinh-nghiem" className="text-sm font-bold text-white/40 hover:text-primary transition-colors flex items-center gap-2">
                                    <ArrowLeft className="w-4 h-4" /> Quay về danh sách
                                </Link>
                                <button className="text-sm font-bold text-white/40 hover:text-primary transition-colors flex items-center gap-2">
                                    <Share2 className="w-4 h-4" /> Chia sẻ
                                </button>
                            </div>
                        </motion.article>
 
                        {/* Sidebar */}
                        <motion.aside
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="lg:col-span-1"
                        >
                            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 sticky top-24">
                                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-5">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    Bài viết liên quan
                                </h3>
                                <div className="space-y-4">
                                    {related.map(a => (
                                        <Link key={a.id} href={`/kinh-nghiem/${toSlug(a.title, a.id)}`} className="flex gap-3 group">
                                            <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                                <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">{a.title}</h4>
                                                <span className="text-[10px] text-white/25 mt-1 block">{a.date}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </section>
        </main>
    )
}
