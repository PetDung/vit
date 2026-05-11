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
    title: {
        default: 'Marshell - Dầu Nhớt Công Nghiệp & CNC Chính Hãng',
        template: '%s | Marshell Vietnam'
    },
    description: 'Công ty TNHH Thành Lợi Marshell - 15 năm kinh nghiệm cung cấp giải pháp bôi trơn toàn diện cho động cơ Diesel, máy CNC và thiết bị công nghiệp.',
    keywords: ['dầu nhớt', 'dầu cnc', 'dầu thủy lực', 'marshell', 'thành lợi marshell', 'dầu cắt gọt', 'dầu bôi trơn'],
    authors: [{ name: 'Marshell Vietnam' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: 'https://marshell.vn',
        siteName: 'Marshell Vietnam',
        title: 'Marshell - Dầu Nhớt Công Nghiệp Chất Lượng Cao',
        description: 'Chuyên cung cấp dầu nhớt động cơ, dầu thủy lực và dầu máy CNC nhập khẩu.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Marshell Vietnam - Dầu Nhớt Công Nghiệp'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Marshell Vietnam',
        description: 'Giải pháp bôi trơn công nghiệp hàng đầu.',
        images: ['/og-image.jpg'],
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/icon.png', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="vi">
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
