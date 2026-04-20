"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    BarChart3, Calendar, ChevronLeft, Download, 
    Filter, LayoutGrid, List, MousePointer2, 
    Share2, TrendingUp, Users, Eye, Activity,
    CalendarDays, Clock
} from "lucide-react"
import Link from "next/link"
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie
} from "recharts"

const DATE_PRESETS = [
    { label: "7 Ngày qua", value: "7daysAgo" },
    { label: "30 Ngày qua", value: "30daysAgo" },
    { label: "90 Ngày qua", value: "90daysAgo" },
    { label: "12 Tháng qua", value: "365daysAgo" },
]

export default function StatsContent() {
    const [dateRange, setDateRange] = useState("30daysAgo")
    const [trafficData, setTrafficData] = useState<any[]>([])
    const [eventsData, setEventsData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState({
        totalSessions: 0,
        totalPages: 0,
        avgDaily: 0
    })

    const fetchData = async (range: string) => {
        setLoading(true)
        try {
            const [trafficRes, eventsRes] = await Promise.all([
                fetch(`/api/analytics/traffic?startDate=${range}`),
                fetch(`/api/analytics/events?startDate=${range}`)
            ])
            const traffic = await trafficRes.json()
            const events = await eventsRes.json()

            const data = traffic.data || []
            setTrafficData(data)
            setEventsData(events.events || [])

            // Calculate summary
            const sessions = data.reduce((acc: number, curr: any) => acc + curr.sessions, 0)
            const views = data.reduce((acc: number, curr: any) => acc + curr.views, 0)
            setSummary({
                totalSessions: sessions,
                totalPages: views,
                avgDaily: Math.round(sessions / (data.length || 1))
            })

        } catch (error) {
            console.error("Failed to fetch analytics:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(dateRange)
    }, [dateRange])

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/quan-ly" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all group">
                            <ChevronLeft className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter">Phân tích dữ liệu</h1>
                            <p className="text-white/40 text-sm font-medium">Báo cáo hiệu suất website từ Google Analytics 4</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl overflow-x-auto no-scrollbar">
                        {DATE_PRESETS.map((preset) => (
                            <button
                                key={preset.value}
                                onClick={() => setDateRange(preset.value)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                                    dateRange === preset.value 
                                    ? "bg-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]" 
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Tổng lượt truy cập", value: summary.totalSessions.toLocaleString(), icon: Users, color: "text-blue-500", label: "Sessions" },
                        { title: "Tổng lượt xem trang", value: summary.totalPages.toLocaleString(), icon: Eye, color: "text-purple-500", label: "Page Views" },
                        { title: "Trung bình mỗi ngày", value: summary.avgDaily.toLocaleString(), icon: Activity, color: "text-green-500", label: "Session/Day" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-6"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                                <item.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">{item.title}</p>
                                <p className="text-2xl font-black">{loading ? "..." : item.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Detailed Traffic Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10" />
                            
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-wide flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-primary" />
                                        Biểu đồ lưu lượng
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Dữ liệu hợp nhất</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Lượt truy cập</div>
                                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500" /> Lượt xem trang</div>
                                </div>
                            </div>

                            <div className="h-[400px] w-full">
                                {loading ? (
                                    <div className="w-full h-full border border-dashed border-white/10 rounded-3xl flex items-center justify-center animate-pulse text-white/20 font-mono text-sm">
                                        Đang tổng hợp dữ liệu thời gian...
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={trafficData}>
                                            <defs>
                                                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#ffffff30', fontSize: 10 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#ffffff30', fontSize: 10 }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#141415', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                                labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', fontWeight: '900' }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="sessions" 
                                                stroke="var(--primary)" 
                                                strokeWidth={4}
                                                fillOpacity={1} 
                                                fill="url(#colorSessions)" 
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="views" 
                                                stroke="#8b5cf6" 
                                                strokeWidth={4}
                                                fillOpacity={1} 
                                                fill="url(#colorViews)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Events & Insights */}
                    <div className="space-y-8">
                        {/* Top Events */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col h-full"
                        >
                            <h2 className="text-xl font-black uppercase tracking-wide flex items-center gap-3 mb-8">
                                <Activity className="w-6 h-6 text-amber-500" />
                                Tương tác
                            </h2>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 no-scrollbar">
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <div key={i} className="h-14 w-full bg-white/[0.02] rounded-2xl animate-pulse" />
                                    ))
                                ) : eventsData.length > 0 ? (
                                    eventsData.map((ev, i) => (
                                        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-amber-500/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${
                                                    ev.category === 'conversion' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/10 text-primary'
                                                }`}>
                                                    {ev.category === 'conversion' ? "🌟" : i + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-xs font-bold transition-colors truncate uppercase leading-none mb-1.5 ${
                                                        ev.category === 'conversion' ? 'text-amber-500' : 'text-white/80 group-hover:text-primary'
                                                    }`}>
                                                        {ev.eventName}
                                                    </p>
                                                    <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                                                        {ev.category === 'conversion' ? 'Chuyển đổi' : 'Tương tác'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-white">{ev.count.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-white/10 gap-4 opacity-50">
                                        <BarChart3 className="w-12 h-12" />
                                        <p className="text-[10px] uppercase font-black">Chưa có dữ liệu tương tác</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                <h4 className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Chu kỳ phân tích
                                </h4>
                                <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                                    Hệ thống Google Analytics 4 thường trễ 24-48 giờ cho báo cáo lịch sử chính xác nhất.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    )
}
