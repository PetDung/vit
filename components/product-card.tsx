"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Box, Droplets, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Product {
    id: string
    name: string
    category: string
    description: string
    image: string
    featured?: boolean
}

interface ProductCardProps {
    product: Product
    index?: number
    className?: string
}

export function ProductCard({ product, index = 0, className = "" }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 h-full ${className}`}
        >
            <Link href={`/san-pham/${product.id}`} className={`flex h-full w-full ${className.includes('md:flex-row') ? 'md:flex-row' : 'flex-col'}`}>
                {/* Background Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/5 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-500" />

                {/* Image Container */}
                <div className={`relative overflow-hidden w-full ${className.includes('md:flex-row') ? 'md:w-2/5 h-[300px] md:h-auto' : 'h-[250px] md:h-2/5 flex-1'}`}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white/90">
                            {product.category}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className={`relative z-10 p-6 flex flex-col justify-between ${className.includes('md:flex-row') ? 'md:w-3/5 md:p-8' : 'h-1/2 flex-1'}`}>
                    <div>
                        <h3 className={`font-black text-white uppercase leading-tight mb-3 group-hover:text-primary transition-colors ${className.includes('md:col-span-2') ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                            {product.name}
                        </h3>
                        <p className={`text-white/60 text-sm leading-relaxed mb-6 ${className.includes('md:col-span-2') ? 'line-clamp-none' : 'line-clamp-3'}`}>
                            {product.description}
                        </p>
                    </div>

                    {/* Footer Action */}
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <span className="text-sm font-bold uppercase tracking-widest">Xem Chi Tiết</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>

                        {/* Decorative Icon */}
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-primary group-hover:text-primary transition-colors">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
