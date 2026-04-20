"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
    duration?: number
}

export function Reveal({
    children,
    className,
    delay = 0,
    duration = 700
}: RevealProps) {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                threshold: 0.05,
                rootMargin: "0px 0px -50px 0px"
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all",
                isVisible
                    ? "animate-in slide-in-from-bottom fade-in fill-mode-backwards"
                    : "opacity-0",
                className
            )}
            style={{
                animationDuration: `${duration}ms`,
                animationDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    )
}
