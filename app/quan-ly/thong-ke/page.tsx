import { Suspense } from "react"
import StatsContent from "./stats-content"
import { ShieldCheck } from "lucide-react"

export const metadata = {
    title: "Thống kê chi tiết | Quản trị Marshell",
    description: "Phân tích lưu lượng truy cập và hành vi người dùng chuyên sâu",
}

export default function DeepStatsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-white/40 text-sm font-medium animate-pulse">Đang tải phân tích dữ liệu...</p>
                </div>
            </div>
        }>
            <StatsContent />
        </Suspense>
    )
}
