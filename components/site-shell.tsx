"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AutoThemeProvider } from "@/components/theme-provider"

export function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isManager = pathname.startsWith("/quan-ly")
    const isLanding = pathname === "/"

    // Manager page: no shell
    if (isManager) {
        return <>{children}</>
    }

    // Landing page: no header/footer, no theme
    if (isLanding) {
        return <>{children}</>
    }

    // Theme pages: wrap with AutoThemeProvider + Header/Footer
    return (
        <AutoThemeProvider>
            <Header />
            {children}
            <Footer />
        </AutoThemeProvider>
    )
}
