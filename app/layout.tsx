import React from "react"
import type { Metadata } from 'next'
import { Roboto_Condensed } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from "@/components/smooth-scroll"
import { SiteShell } from "@/components/site-shell"
import { Toaster } from "@/components/ui/sonner"
import GAWrapper from "@/components/ui/GAWrapper";

const robotoCondensed = Roboto_Condensed({
    subsets: ["latin", "vietnamese"],
    variable: "--font-sans",
    weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
    title: 'Marshell - Dầu Nhớt Công Nghiệp Chất Lượng Cao',
    description: 'Công ty TNHH Thành Lợi Marshell - 15 năm kinh nghiệm cung cấp dầu nhớt, dầu thủy lực chất lượng cao cho động cơ Diesel, xe tải, tàu thuyền tại Việt Nam.',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${robotoCondensed.variable} font-sans antialiased`}>
                <SmoothScroll>
                    <SiteShell>
                        {children}
                    </SiteShell>
                </SmoothScroll>
                <Toaster />
                <GAWrapper gaId="G-YK5BMDFH63" />
            </body>
        </html>
    )
}
