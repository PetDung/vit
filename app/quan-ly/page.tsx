"use client"

import { Suspense } from "react"
import ManagerPageContent from "./manager-content"

export default function ManagerPage() {
    return (
        <Suspense fallback={
            <div className="h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
                <div className="animate-pulse text-primary text-xl font-bold">Đang tải...</div>
            </div>
        }>
            <ManagerPageContent />
        </Suspense>
    )
}
