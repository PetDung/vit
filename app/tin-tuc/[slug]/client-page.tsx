"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Eye, ChevronRight, ArrowLeft, Tag, Share2 } from "lucide-react"
import { type NewsArticle } from "@/lib/news"
import { toSlug } from "@/lib/utils"
import { sendGAEvent } from '@next/third-parties/google';

export default function NewsDetailClientPage({ article, related }: { article: NewsArticle, related: NewsArticle[] }) {
    useEffect(() => {
        if (article) {
            sendGAEvent('event', 'view_item', {
                items: [{
                    item_id: article.id,
                    item_name: article.title,
                    item_category: 'news'
                }]
            })
        }
    }, [article])

    return (
        <main className="bg-black text-white min-h-screen">

            {/* ═══ HERO IMAGE ═══ */}
            <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
                <Image src={article.image} alt={article.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

                {/* Overlay content */}
                <div className="absolute inset-0 flex items-end">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full pb-10 lg:pb-14">
                        {/* Breadcrumb */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-xs text-white/50 mb-5"
                        >
                            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-primary/80 truncate max-w-[200px]">{article.title}</span>
                        </motion.div>

                        {/* Category badge */}
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-wider mb-4"
                        >
                            <Tag className="w-3 h-3" />
                            {article.category}
                        </motion.span>

                        {/* Title */}
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

                        {/* Meta */}
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="prose prose-invert prose-lg max-w-none prose-p:text-white/60 prose-headings:text-white prose-strong:text-primary prose-a:text-primary"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Share buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between"
                            >
                                <span className="text-sm font-bold text-white/50 flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Chia sẻ bài viết
                                </span>
                                <div className="flex items-center gap-4">
                                    <a 
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => sendGAEvent('event', 'share', { 
                                            method: 'facebook', 
                                            content_type: 'news', 
                                            item_id: article.title 
                                        })}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all group"
                                        title="Chia sẻ lên Facebook"
                                    >
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </a>
                                    <a 
                                        href={`https://zalo.me/share?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={() => sendGAEvent('event', 'share', { 
                                            method: 'zalo', 
                                            content_type: 'news', 
                                            item_id: article.title 
                                        })}
                                        className="flex items-center justify-center h-10 px-4 rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary transition-all text-[11px] font-black uppercase tracking-widest"
                                    >
                                        Zalo
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* SIDEBAR */}
                        <aside className="lg:col-span-4 space-y-8 lg:sticky top-24 self-start">
                            {/* Back button */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                <Link href="/tin-tuc" className="group inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Tất cả bài viết
                                </Link>
                            </motion.div>

                            {/* Related articles */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-black uppercase tracking-wider mb-5">Bài viết liên quan</h3>
                                <div className="space-y-4">
                                    {related.map(item => (
                                        <Link key={item.id} href={`/tin-tuc/${toSlug(item.title, item.id)}`} className="group flex items-start gap-4">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{item.title}</p>
                                                <p className="text-xs text-white/40 mt-1">{item.date}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </aside>

                    </div>
                </div>
            </section>
        </main>
    )
}
