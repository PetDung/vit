"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxProps {
    children: React.ReactNode
    offset?: number
    className?: string
    speed?: number
}

export function Parallax({ children, offset = 50, className = "", speed = 0.5 }: ParallaxProps) {
    const ref = useRef(null)

    // Track the scroll progress of this specific container relative to the viewport
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // Map progress (0-1) to pixel offset
    // We double the speed here to make the effect more noticeable as requested ("rõ ràng")
    const y = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed])

    // Smooth out the movement using spring physics for that "luxurious" feel
    const springY = useSpring(y, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    return (
        <div ref={ref} className={cn("relative", className)}>
            <motion.div style={{ y: springY }} className="h-full w-full will-change-transform">
                {children}
            </motion.div>
        </div>
    )
}
