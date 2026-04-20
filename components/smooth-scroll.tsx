"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"

export function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    useEffect(() => {
        // Skip smooth scroll for manager page
        if (pathname.startsWith("/quan-ly")) return

        let lenis: any = null

        // Initialize Lenis dynamically
        const initLenis = async () => {
            const Lenis = (await import("lenis")).default
            lenis = new Lenis({
                duration: 1, // Smooth duration (default 1.2s)
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1.5,
            })

            // Animation Loop
            function raf(time: number) {
                lenis?.raf(time)
                requestAnimationFrame(raf)
            }

            requestAnimationFrame(raf)
        }

        initLenis()

        // Cleanup
        return () => {
            lenis?.destroy()
        }
    }, [pathname])

    return (
        <>
            {children}
        </>
    )
}
