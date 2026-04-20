"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Package, FileText, Settings,
    MessageSquare, Activity, ChevronRight, ChevronLeft,
    Award, BarChart3, Globe, TrendingUp
} from "lucide-react"
import Link from "next/link"
import { productApi, newsApi, experienceApi, contactsApi, analyticsApi } from "@/lib/api"
import { 
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from "recharts"

export default function ManagerPageContent() {
    const [activeUsers, setActiveUsers] = useState<number>(0);
    const [realtimeData, setRealtimeData] = useState<any>({ timeline: [], pages: [], devices: [], events: [] });
    // Pagination States
    const [pagesCurrentPage, setPagesCurrentPage] = useState(0);
    const [devicesCurrentPage, setDevicesCurrentPage] = useState(0);
    const [eventsCurrentPage, setEventsCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 5;
    const [trafficData, setTrafficData] = useState<any[]>([]);
    const [eventsData, setEventsData] = useState<any[]>([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [realtimeLoading, setRealtimeLoading] = useState(true);
    const [counts, setCounts] = useState({
        products: 0,
        articles: 0,
        contacts: 0,
        visitors: 0,
        today: 0,
        live: 0
    })
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        
        // 1. Fetch count stats
        const fetchCounts = async () => {
            try {
                const [products, news, experience, contacts, analytics] = await Promise.all([
                    productApi.getAll(),
                    newsApi.getAll(),
                    experienceApi.getAll(),
                    contactsApi.getAll(),
                    analyticsApi.get().catch(() => ({ totalVisitors: 0, todayVisitors: 0, liveSessions: 0 }))
                ])
                setCounts({
                    products: products?.length || 0,
                    articles: (news?.length || 0) + (experience?.length || 0),
                    contacts: contacts?.filter((c: any) => c.status === 'unread')?.length || 0,
                    visitors: analytics?.totalVisitors || 0,
                    today: analytics?.todayVisitors || 0,
                    live: analytics?.liveSessions || 0
                })
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error)
            } finally {
                setLoading(false)
            }
        }
 
        // 2. Fetch GA4 Realtime every 30s
        const fetchRealtime = async () => {
            try {
                const res = await fetch('/api/analytics/realtime/full');
                const data = await res.json();
                if (data) {
                    setActiveUsers(data.totalActive || 0);
                    setRealtimeData(data);
                    setRealtimeLoading(false);
                }
            } catch (err) {
                console.error("Realtime fetch error:", err);
            }
        };
 
        // 3. Fetch GA4 Traffic & Events
        const fetchAnalytics = async () => {
            setAnalyticsLoading(true);
            try {
                const [trafficRes, eventsRes] = await Promise.all([
                    fetch('/api/analytics/traffic'),
                    fetch('/api/analytics/events')
                ]);
                const traffic = await trafficRes.json();
                const events = await eventsRes.json();
                
                setTrafficData(traffic.data || []);
                setEventsData(events.events || []);
            } catch (err) {
                console.error("Analytics fetch error:", err);
            } finally {
                setAnalyticsLoading(false);
            }
        };
 
        fetchCounts();
        fetchRealtime();
        fetchAnalytics();
 
        const interval = setInterval(fetchRealtime, 30000);
        return () => clearInterval(interval);
    }, [])

    const stats = [
        { title: "Tổng Sản Phẩm", value: loading ? "..." : counts.products.toString(), icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", tag: "Tồn kho" },
        { title: "Bài Viết", value: loading ? "..." : counts.articles.toString(), icon: FileText, color: "text-green-500", bg: "bg-green-500/10", tag: "Nội dung" },
        { title: "Liên Hệ Mới", value: loading ? "..." : counts.contacts.toString(), icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10", tag: "Khách hàng" },
        { title: "Đang truy cập", value: activeUsers.toString(), icon: Globe, color: "text-purple-500", bg: "bg-purple-500/10", tag: "GA4 Live", isGA: true },
    ]

    const menuItems = [
        { title: "Quản lý Sản phẩm", desc: "Thêm, sửa, xóa sản phẩm và danh mục", icon: Package, href: "/quan-ly/san-pham" },
        { title: "Quản lý Tin tức", desc: "Quản lý bài viết, chuyên mục tin tức", icon: FileText, href: "/quan-ly/tin-tuc" },
        { title: "Kinh nghiệm & Mẹo", desc: "Quản lý bài viết chia sẻ kinh nghiệm", icon: Award, href: "/quan-ly/kinh-nghiem" },
        { title: "Khách hàng liên hệ", desc: "Xem và phản hồi yêu cầu liên hệ", icon: MessageSquare, href: "/quan-ly/lien-he" },
        { title: "Cấu hình Website", desc: "Biểu trưng, thông tin liên hệ, SEO", icon: Settings, href: "/quan-ly/cai-dat" },
    ]

    return (
        <main className="min-h-screen bg-[#0a0a0b] text-white p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                            Bảng Trạng Thái
                        </h1>
                        <p className="text-white/40 text-sm">
                            Tổng quan hệ thống quản trị website Marshell
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Hệ thống hoạt động tốt
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8 mt-12">
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Tổng quan hệ thống</h2>
                    <Link 
                        href="/quan-ly/thong-ke" 
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Thống kê chi tiết
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{stat.title}</p>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${stat.color} ${stat.bg} border border-${stat.color.split('-')[1]}-500/20`}>
                                        {stat.tag}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-black">{stat.value}</p>
                                    {stat.isGA && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/20 font-medium leading-none">G-YK5BMDFH63</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] text-green-500 font-bold flex items-center gap-0.5">
                                                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                                    Online
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Realtime Dashboard - Jumping Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10 rounded-full" />
                        
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                                    Người dùng theo thời gian thực (30 phút qua)
                                </h3>
                                <p className="text-white/40 text-xs mt-1">Cập nhật tự động mỗi 30 giây</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-white leading-none">{activeUsers}</p>
                                <p className="text-[10px] text-white/30 uppercase font-black mt-1">Hội thoại hoạt động</p>
                            </div>
                        </div>

                        <div className="h-[200px] w-full">
                            {realtimeLoading ? (
                                <div className="w-full h-full flex items-center justify-center gap-1">
                                    {Array(30).fill(0).map((_, i) => (
                                        <div key={i} className="w-full bg-white/5 rounded-t-sm animate-pulse" style={{ height: `${((i * 7) % 60) + 20}%` }} />
                                    ))}
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={realtimeData.timeline}>
                                        <Tooltip 
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-[#1a1a1c] border border-white/10 p-2 rounded-lg text-[10px] font-bold">
                                                            <p className="text-white/40">{payload[0].payload.minute} phút trước</p>
                                                            <p className="text-primary">{payload[0].value} người dùng</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar 
                                            dataKey="users" 
                                            radius={[2, 2, 0, 0]}
                                        >
                                            {realtimeData?.timeline?.map((entry: any, index: number) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.users > 0 ? "var(--primary)" : "rgba(255,255,255,0.05)"}
                                                    className="transition-all duration-500"
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-2 px-1">
                            <span className="text-[10px] text-white/20 uppercase font-bold">30 phút trước</span>
                            <span className="text-[10px] text-white/20 uppercase font-bold">Hiện tại</span>
                        </div>
                    </motion.div>

                    {/* Device & Page Breakdown */}
                    <div className="flex flex-col gap-6">
                        {/* Pages Widget */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex-1 min-h-[160px] flex flex-col justify-between"
                        >
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Trang đang xem
                            </h4>
                            <div className="space-y-3 flex-1">
                                {realtimeData.pages?.length > 0 ? (
                                    realtimeData.pages.slice(pagesCurrentPage * ITEMS_PER_PAGE, (pagesCurrentPage + 1) * ITEMS_PER_PAGE).map((p: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-xs">
                                            <span className="text-white/60 truncate max-w-[150px] font-mono hover:text-primary transition-colors cursor-default">{p.path}</span>
                                            <span className="font-black text-white">{p.users}</span>
                                        </div>
                                    ))
                                ) : <p className="text-[10px] text-white/10 italic">Đang chờ dữ liệu...</p>}
                            </div>

                            {/* Pagination Controls */}
                            {realtimeData.pages?.length > ITEMS_PER_PAGE && (
                                <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-white/5">
                                    <button 
                                        disabled={pagesCurrentPage === 0}
                                        onClick={() => setPagesCurrentPage(prev => prev - 1)}
                                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </button>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">
                                        {pagesCurrentPage + 1} / {Math.ceil(realtimeData.pages.length / ITEMS_PER_PAGE)}
                                    </span>
                                    <button 
                                        disabled={pagesCurrentPage >= Math.ceil(realtimeData.pages.length / ITEMS_PER_PAGE) - 1}
                                        onClick={() => setPagesCurrentPage(prev => prev + 1)}
                                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </motion.div>

                        {/* Devices Widget */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex-1 min-h-[160px] flex flex-col justify-between"
                        >
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-4 flex items-center gap-2">
                                <Activity className="w-3 h-3" /> Thiết bị
                            </h4>
                            <div className="space-y-3 flex-1">
                                {realtimeData.devices?.length > 0 ? (
                                    realtimeData.devices.slice(devicesCurrentPage * ITEMS_PER_PAGE, (devicesCurrentPage + 1) * ITEMS_PER_PAGE).map((d: any, i: number) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                                                <span className="text-white/40">{d.category}</span>
                                                <span className="text-white">{Math.round((d.users / activeUsers) * 100) || 0}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-primary transition-all duration-1000" 
                                                    style={{ width: `${(d.users / activeUsers) * 100 || 0}%` }} 
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : <p className="text-[10px] text-white/10 italic text-center py-4">Đang tải...</p>}
                            </div>

                            {/* Pagination Controls */}
                            {realtimeData.devices?.length > ITEMS_PER_PAGE && (
                                <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-white/5">
                                    <button 
                                        disabled={devicesCurrentPage === 0}
                                        onClick={() => setDevicesCurrentPage(prev => prev - 1)}
                                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="w-3 h-3" />
                                    </button>
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-tighter">
                                        {devicesCurrentPage + 1} / {Math.ceil(realtimeData.devices.length / ITEMS_PER_PAGE)}
                                    </span>
                                    <button 
                                        disabled={devicesCurrentPage >= Math.ceil(realtimeData.devices.length / ITEMS_PER_PAGE) - 1}
                                        onClick={() => setDevicesCurrentPage(prev => prev + 1)}
                                        className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Realtime Events Widget */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col relative overflow-hidden min-h-[360px]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] -z-10 rounded-full" />
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-6 flex items-center gap-2">
                             <span className="w-1 h-1 rounded-full bg-amber-500 animate-ping" />
                             Hành động LIVE
                        </h4>
                        
                        <div className="flex-1 space-y-4">
                            {realtimeLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-10 w-full bg-white/[0.02] rounded-xl animate-pulse" />
                                ))
                            ) : realtimeData.events?.length > 0 ? (
                                realtimeData.events.slice(eventsCurrentPage * ITEMS_PER_PAGE, (eventsCurrentPage + 1) * ITEMS_PER_PAGE).map((ev: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex items-center gap-3">
                                            {ev.category === 'conversion' ? (
                                                <span className="text-[10px] text-amber-500 font-black">🌟</span>
                                            ) : (
                                                <span className="text-[10px] font-black text-white/20">{(eventsCurrentPage * ITEMS_PER_PAGE) + i + 1}</span>
                                            )}
                                            <p className={`text-[11px] font-bold transition-colors truncate max-w-[120px] ${
                                                ev.category === 'conversion' ? 'text-amber-500' : 'text-white/70 group-hover:text-amber-500'
                                            }`}>
                                                {ev.name}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-black ${ev.category === 'conversion' ? 'text-amber-500' : 'text-white'}`}>
                                            {ev.count}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[10px] text-white/10 italic text-center py-10">Chưa có hành động nào...</p>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {realtimeData.events?.length > ITEMS_PER_PAGE && (
                            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-white/5">
                                <button 
                                    disabled={eventsCurrentPage === 0}
                                    onClick={() => setEventsCurrentPage(prev => prev - 1)}
                                    className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-3 h-3 text-amber-500" />
                                </button>
                                <span className="text-[9px] font-bold text-amber-500/30 uppercase tracking-tighter">
                                    {eventsCurrentPage + 1} / {Math.ceil(realtimeData.events.length / ITEMS_PER_PAGE)}
                                </span>
                                <button 
                                    disabled={eventsCurrentPage >= Math.ceil(realtimeData.events.length / ITEMS_PER_PAGE) - 1}
                                    onClick={() => setEventsCurrentPage(prev => prev + 1)}
                                    className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-3 h-3 text-amber-500" />
                                </button>
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-white/5 opacity-40">
                             <p className="text-[9px] text-white/20 italic leading-relaxed">
                                Dữ liệu sự kiện được cập nhật tức thì khi có tương tác từ chuột/phím.
                             </p>
                        </div>
                    </motion.div>
                </div>

                {/* Detailed Analytics Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="group relative cursor-pointer"
                >
                    <Link href="/quan-ly/thong-ke">
                        <div className="p-8 rounded-[40px] bg-gradient-to-r from-primary/10 to-purple-500/10 border border-white/10 hover:border-primary/30 transition-all overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-[400px] h-full bg-primary/5 blur-[100px] -z-10" />
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black uppercase tracking-wide mb-1">Dữ liệu hiệu suất 30 ngày</h2>
                                        <p className="text-white/40 text-sm">Xem chi tiết lượt truy cập, hành vi và nguồn người tiêu dùng theo thời gian.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs">
                                    Khám phá ngay <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
 
                {/* Quick Actions / Modules */}
                <div>
                    <h2 className="text-lg font-black uppercase tracking-wide mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        Chức năng quản trị
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {menuItems.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                            >
                                <Link href={item.href} className="block group">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between">
                                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />

                                        <div>
                                            <item.icon className="w-8 h-8 text-primary mb-5" />
                                            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-white/40 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center justify-end">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}