"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isManager = pathname.startsWith("/quan-ly")

    if (isManager) {
        return <>{children}</>
    }
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
