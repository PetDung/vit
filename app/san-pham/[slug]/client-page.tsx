"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { toSlug, findBySlug, type Product } from "@/lib/products"
import { Phone, Loader2, ChevronRight, ScrollText, AlignJustify, Share2 } from "lucide-react"
import Link from "next/link"
import { sendGAEvent } from '@next/third-parties/google';

export default function ProductClientPage({ initialProducts, slug }: { initialProducts: Product[], slug: string }) {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>(initialProducts)

    // Derived initial state for immediate hydration without empty images
    const initialProd = findBySlug(initialProducts, slug) || initialProducts[0]
    const initialIdx = initialProducts.findIndex(p => p.id === initialProd?.id)

    const [activeIndex, setActiveIndex] = useState(initialIdx >= 0 ? initialIdx : 0)
    const [loading, setLoading] = useState(false)
    const [activeImage, setActiveImage] = useState<string>(initialProd?.image || "")
    const contentRef = useRef<HTMLDivElement>(null)

    const scrollToContent = () => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (products.length > 0) {
            let idx = 0;
            if (slug) {
                const found = findBySlug(products, slug)
                if (found) {
                    idx = products.findIndex(p => p.id === found.id)
                }
            }
            setActiveIndex(idx >= 0 ? idx : 0)
            setActiveImage(products[idx >= 0 ? idx : 0]?.image || "")
        }
    }, [slug, products])

    const product = products[activeIndex]

    // Update active image when changing product
    useEffect(() => {
        if (product) {
            setActiveImage(product.image)
            sendGAEvent('event', `view_item_${product.name}`, { value: 1 })
        }
    }, [activeIndex, product])

    const selectProduct = (idx: number) => {
        const selectedProd = products[idx]
        if (selectedProd) {
            router.push(`/san-pham/${toSlug(selectedProd.name, selectedProd.id)}`, { scroll: false })
            setActiveIndex(idx)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    if (loading || !product) {
        return (
            <main className="bg-[#050505] text-white min-h-screen flex flex-col items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-ping absolute"></div>
                    <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
                <p className="mt-8 text-white/50 animate-pulse tracking-widest font-mono text-sm uppercase">Đang tải siêu phẩm...</p>
            </main>
        )
    }

    if (products.length === 0) {
        return (
            <main className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/30 text-lg font-bold mb-2">Chưa có sản phẩm nào</p>
                    <p className="text-white/15 text-sm">Vui lòng thêm sản phẩm trong trang quản lý.</p>
                </div>
            </main>
        )
    }

    // Determine all images for gallery
    const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image]

    // Robust check for empty content (ignores formatting tags like <p><br></p>)
    const hasContent = product.content && product.content.replace(/<[^>]*>?/gm, '').trim().length > 0;

    return (
        <main className="bg-[#050505] text-white min-h-screen flex flex-col overflow-hidden relative selection:bg-primary/30">

            {/* ─── IMMERSIVE HERO SECTION ─── */}
            <div className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-8 lg:pt-24 lg:pb-0 overflow-hidden">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`bg-${product.id}`}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <Image src={product.image} alt="Background" fill className="object-cover blur-[100px] saturate-200" priority />
                        </motion.div>
                    </AnimatePresence>
                    {/* Modern Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] z-10 pointer-events-none" />
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-20" />
                </div>

                <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

                    {/* Hero Text Content */}
                    <div className="lg:col-span-6 flex flex-col pt-10 lg:pt-0 order-2 lg:order-1">
                        <motion.div
                            key={`content-${product.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4 lg:mt-8">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white/70 font-mono">
                                    Mã SP: {product.code || toSlug(product.name, product.id).toUpperCase()}
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/30 mb-3 drop-shadow-sm leading-[0.9]">
                                {product.name}
                            </h1>

                            <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-primary/20 rounded-full mb-3" />

                            <div className="text-xl lg:text-2xl font-bold text-white flex items-center gap-4 mb-3">
                                <span className="text-white/40 text-sm lg:text-base uppercase tracking-wider font-normal">Giá bán</span>
                                <span className="text-primary text-2xl">Liên hệ</span>
                            </div>

                            {/* Short Description */}
                            {product.description && (
                                <div className="text-white/60 text-sm lg:text-sm xl:text-base leading-relaxed mb-4 prose prose-invert prose-p:my-1 border-l-2 border-white/10 pl-4 line-clamp-2 lg:line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: product.description }} />
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button size="lg" onClick={scrollToContent} className="h-10 lg:h-12 px-6 lg:px-8 bg-primary hover:bg-white text-black font-black uppercase tracking-widest rounded-none shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                    <AlignJustify className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                                    Xem chi tiết
                                </Button>
                                <Link href="/lien-he">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={() => sendGAEvent('event', 'click_nut_lien_he', {
                                            product: product.name,
                                            source: 'product_detail_hero'
                                        })}
                                        className="h-10 lg:h-12 px-6 lg:px-8 bg-transparent border-white/20 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest rounded-none transition-all w-full"
                                    >
                                        <Phone className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                                        Liên hệ ngay
                                    </Button>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
                                                sendGAEvent('event', 'share', { method: 'facebook', content_type: 'product', item_id: product.name })
                                            }
                                        }}
                                        className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all text-white/50"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                window.open(`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`, '_blank')
                                                sendGAEvent('event', 'share', { method: 'zalo', content_type: 'product', item_id: product.name })
                                            }
                                        }}
                                        className="flex-1 h-10 lg:h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all text-[11px] font-black uppercase tracking-widest text-white/50"
                                    >
                                        Zalo
                                    </button>
                                </div>
                            </div>

                            {/* Quick Product Switcher */}
                            {products.length > 1 && (
                                <div className="mt-6 lg:mt-6 pt-4 lg:pt-5 border-t border-white/10">
                                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-3">Chuyển sang sản phẩm khác</h4>
                                    <Carousel
                                        opts={{
                                            align: "start",
                                            dragFree: true
                                        }}
                                        className="w-full relative"
                                    >
                                        <CarouselContent className="-ml-3 pb-2">
                                            {products.map((p, idx) => (
                                                <CarouselItem key={p.id} className="pl-3 basis-auto">
                                                    <button
                                                        onClick={() => selectProduct(idx)}
                                                        className={`relative group w-28 h-20 sm:w-32 sm:h-24 lg:w-36 lg:h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeIndex === idx ? 'border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-white/10 hover:border-white/30'}`}
                                                    >
                                                        <Image src={p.images?.[0] || p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-90 group-hover:opacity-100 transition-opacity" />
                                                        <div className="absolute inset-x-0 bottom-0 p-2 lg:p-3 text-left">
                                                            <p className={`text-[10px] lg:text-xs font-bold uppercase line-clamp-2 leading-tight transition-colors ${activeIndex === idx ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                                                {p.name}
                                                            </p>
                                                        </div>
                                                    </button>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <div className="absolute -top-10 right-10 flex gap-2">
                                            <CarouselPrevious className="relative inset-auto translate-y-0 h-7 w-7 bg-white/5 border-white/20 hover:bg-primary hover:text-black" />
                                            <CarouselNext className="relative inset-auto translate-y-0 h-7 w-7 bg-white/5 border-white/20 hover:bg-primary hover:text-black" />
                                        </div>
                                    </Carousel>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Hero Product Image */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
                        <div
                            key={activeImage}
                            className="relative w-full max-w-[260px] lg:max-w-[340px] xl:max-w-[400px] aspect-square drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
                        >
                            {activeImage && (
                                <Image
                                    src={activeImage}
                                    alt={product.name}
                                    fill
                                    className="object-contain animate-in fade-in duration-500"
                                    priority
                                />
                            )}
                            {/* Glow under image */}
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full" />
                        </div>

                        {/* Image Gallery Thumbnails */}
                        {galleryImages.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center justify-center gap-2 mt-4 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10"
                            >
                                {galleryImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : 'border-transparent hover:border-white/30 opacity-50 hover:opacity-100'}`}
                                    >
                                        <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── DETAILED CONTENT SECTION ─── */}
            {hasContent && (
                <div ref={contentRef} className="relative z-20 w-full bg-[#050505] py-20 lg:py-32">
                    <div className="absolute top-0 inset-x-0 h-px bg-white/5" />

                    <div className="max-w-5xl mx-auto px-4 sm:px-8">
                        <motion.div
                            key={`details-${product.id}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-2xl p-8 sm:p-14 backdrop-blur-md shadow-2xl">

                                <div className="mb-10 pb-6 border-b border-white/5">
                                    <div className="inline-flex items-center gap-3">
                                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                                        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-white/90">Thông tin chi tiết</h2>
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-lg max-w-none 
                                    prose-headings:font-bold prose-headings:tracking-wide prose-headings:text-white/90 prose-headings:mt-8 prose-headings:mb-4
                                    prose-p:text-white/70 prose-p:leading-[1.8] prose-p:font-light
                                    prose-strong:text-white prose-strong:font-bold
                                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-ul:list-none prose-li:relative prose-li:pl-6 prose-li:text-white/70
                                    [&_ul>li]:before:content-[''] [&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-3 [&_ul>li]:before:w-1.5 [&_ul>li]:before:h-1.5 [&_ul>li]:before:bg-primary [&_ul>li]:before:rounded-full"
                                    dangerouslySetInnerHTML={{ __html: product.content as string }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* ─── OTHER PRODUCTS CAROUSEL ─── */}
            <div className="relative z-20 w-full bg-[#030303] py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-3xl font-black uppercase text-white tracking-tight">Sản phẩm khác</h3>
                            <p className="text-white/40 mt-2">Khám phá các sản phẩm nổi bật khác từ Marshell</p>
                        </div>
                    </div>

                    <Carousel
                        opts={{
                            align: "start",
                            loop: true
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 sm:-ml-6">
                            {products.filter((_, idx) => idx !== activeIndex).map((p, idx) => (
                                <CarouselItem key={p.id} className="pl-4 sm:pl-6 basis-1/2 md:basis-1/3 lg:basis-1/4">
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => {
                                            const actualIdx = products.findIndex(prod => prod.id === p.id)
                                            selectProduct(actualIdx)
                                        }}
                                        className="group text-left w-full"
                                    >
                                        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#0A0A0C] border border-white/5 group-hover:border-primary/50 transition-colors mb-4">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Image
                                                src={p.images?.[0] || p.image}
                                                alt={p.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20 transition-opacity">
                                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                    <ChevronRight className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold uppercase truncate group-hover:text-primary transition-colors">{p.name}</h4>
                                        <p className="text-white/40 text-xs font-mono mt-1">{toSlug(p.name, p.id)}</p>
                                    </motion.button>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                            <CarouselPrevious className="left-[-3rem] border-white/20 bg-black/50 hover:bg-primary hover:text-black" />
                            <CarouselNext className="right-[-3rem] border-white/20 bg-black/50 hover:bg-primary hover:text-black" />
                        </div>
                    </Carousel>
                </div>
            </div>

        </main>
    )
}
