"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, useAnimationFrame } from "framer-motion"
import Image from "next/image"
import { Building2, Users, FlaskConical, MapPin, Award, Target, Droplet, Handshake } from "lucide-react"

/* ──────────────────────────────────────────── */
/*  DATA                                        */
/* ──────────────────────────────────────────── */
const stats = [
    { value: 15, suffix: "+", label: "Năm kinh nghiệm", icon: Award, color: "#FFD700" },
    { value: 50, suffix: "+", label: "Nhân viên & Đại lý", icon: Users, color: "#FFD700" },
    { value: 1000, suffix: "+", label: "Khách hàng tin dùng", icon: Handshake, color: "#FFD700" },
    { value: 3, suffix: "", label: "Dòng sản phẩm chính", icon: Droplet, color: "#FFD700" },
]

const timeline = [
    { year: "Khởi đầu", title: "Kinh nghiệm quốc tế", text: "Đội ngũ sáng lập từng làm việc cho các tập đoàn dầu nhờn hàng đầu thế giới, tích lũy kinh nghiệm và công nghệ tiên tiến.", side: "left" as const },
    { year: "Hình thành", title: "Thành lập Marshell", text: "Chọn Hải Phòng — nơi hội tụ của ngành dầu nhờn Việt Nam — làm nơi đặt nhà máy sản xuất hiện đại.", side: "right" as const },
    { year: "Phát triển", title: "Mở rộng thị trường", text: "Xây dựng mạng lưới đại lý trên cả nước, phục vụ đa dạng ngành công nghiệp, vận tải và hàng hải.", side: "left" as const },
    { year: "Hiện tại", title: "Vươn tầm khu vực", text: "50+ nhân viên, hàng nghìn khách hàng, nhà máy tại Lê Thánh Tông — Ngô Quyền — Hải Phòng.", side: "right" as const },
]

const values = [
    { icon: Award, front: "Trung thực", back: "Minh bạch trong mọi hoạt động kinh doanh, từ sản xuất đến phân phối." },
    { icon: Target, front: "Liêm chính", back: "Giữ vững đạo đức kinh doanh, cam kết chất lượng sản phẩm tuyệt đối." },
    { icon: Users, front: "Tôn trọng", back: "Tôn trọng con người — nhân viên, đối tác và khách hàng là trọng tâm." },
]

const brands = ["HYRELIA", "LESTURBO", "BEN MX 3", "GEAR OIL", "LITHIUM GREASE", "MARSHELL"]

/* ──────────────────────────────────────────── */
/*  PAGE                                        */
/* ──────────────────────────────────────────── */
export default function AboutClientPage() {
    const heroRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

    return (
        <main className="bg-black text-white overflow-x-hidden">

            {/* ═══ 1. CINEMATIC HERO ═══ */}
            <section ref={heroRef} className="relative h-[80vh] lg:h-screen flex items-center overflow-hidden">
                {/* Animated Background */}
                <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
                    <Image src="/p/Lesturbo.jpg" alt="Marshell factory" fill className="object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black" />
                </motion.div>

                {/* Floating Particles */}
                <FloatingParticles />

                {/* Content */}
                <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
                    <motion.span
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-block px-5 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-8"
                    >
                        ● Về Chúng Tôi
                    </motion.span>

                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tight leading-[1.2] mb-6 max-w-5xl py-2"
                        >
                            <span className="block pb-2">Mang đến</span>
                            <span className="block shimmer-text pb-2">giá trị thực</span>
                            <span className="block text-white/50 pb-2">cho khách hàng</span>
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-white/40 text-sm lg:text-lg max-w-2xl leading-relaxed"
                    >
                        Đáp ứng nhu cầu năng lượng của xã hội theo những phương cách hiệu quả về mặt kinh tế, xã hội và môi trường.
                    </motion.p>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
                        >
                            <div className="w-1 h-1.5 rounded-full bg-primary" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══ BRAND MARQUEE ═══ */}
            <div className="py-6 border-y border-white/5 bg-white/[0.02] overflow-hidden">
                <BrandMarquee />
            </div>

            {/* ═══ 2. CIRCULAR COUNTER STATS ═══ */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <RevealOnScroll>
                        <p className="text-center text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-12">Con số ấn tượng</p>
                    </RevealOnScroll>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, i) => (
                            <CircularCounter key={i} stat={stat} delay={i * 0.2} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ GLOWING DIVIDER ═══ */}
            <GlowDivider />

            {/* ═══ 3. STORY ═══ */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <RevealOnScroll direction="left">
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/5 group">
                                <Image src="/p/Lesturbo.jpg" alt="Nhà máy Marshell" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-bold text-white/80">
                                        <MapPin className="w-3.5 h-3.5 inline mr-1 text-primary" />
                                        Hải Phòng, Việt Nam
                                    </span>
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll direction="right">
                            <div className="space-y-6">
                                <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight leading-[1.4] py-1">
                                    Từ kinh nghiệm quốc tế đến{" "}
                                    <span className="shimmer-text">thương hiệu Việt</span>
                                </h2>
                                <div className="space-y-4 text-white/50 text-sm lg:text-base leading-relaxed">
                                    <p>
                                        Tại Việt Nam, Marshell sản xuất, kinh doanh và tiếp thị các sản phẩm dầu nhớt cao cấp cho ô tô, xe máy đến các phương tiện vận chuyển chuyên dụng như xe trọng tải nặng, tàu biển.
                                    </p>
                                    <p>
                                        Dưới các nhãn hiệu danh tiếng như <strong className="text-primary">HYRELIA</strong>, <strong className="text-primary">LESTURBO</strong>, <strong className="text-primary">BEN MX 3</strong>... Công nghệ đẳng cấp thế giới hoạt động dựa trên tiêu chí mang đến giá trị thực cho khách hàng.
                                    </p>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                                        <span className="text-primary font-black text-lg block">ISO</span>
                                        <span className="text-white/40 text-[9px] uppercase">Certified</span>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                                        <span className="text-primary font-black text-lg block">API</span>
                                        <span className="text-white/40 text-[9px] uppercase">Standard</span>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-center">
                                        <span className="text-primary font-black text-lg block">CK-4</span>
                                        <span className="text-white/40 text-[9px] uppercase">Grade</span>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* ═══ 4. QUOTE ═══ */}
            <QuoteSection />

            {/* ═══ 5. OIL-PIPE TIMELINE ═══ */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <RevealOnScroll>
                        <p className="text-center text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-4">Lịch sử</p>
                        <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight mb-16 text-center">
                            Hành trình <span className="shimmer-text">phát triển</span>
                        </h2>
                    </RevealOnScroll>

                    <div className="relative">
                        <TimelinePipe />
                        <div className="space-y-12 lg:space-y-0">
                            {timeline.map((item, i) => (
                                <TimelineItem key={i} item={item} index={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ GLOWING DIVIDER ═══ */}
            <GlowDivider />

            {/* ═══ 6. FACTORY / TEAM / R&D ═══ */}
            <section className="py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <RevealOnScroll>
                        <p className="text-center text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-4">Nền tảng</p>
                        <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight mb-12 text-center">
                            Sức mạnh <span className="shimmer-text">Marshell</span>
                        </h2>
                    </RevealOnScroll>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Building2, title: "Nhà máy hiện đại", text: "Nhà máy sản xuất tại Hải Phòng — trung tâm ngành dầu nhờn Việt Nam, trang bị dây chuyền công nghệ tiên tiến.", stat: "1", statLabel: "Nhà máy" },
                            { icon: Users, title: "Đội ngũ chuyên gia", text: "50+ nhân viên và kỹ sư tốt nghiệp từ các trường Đại học danh tiếng, tuân theo qui trình đặc biệt.", stat: "50+", statLabel: "Nhân viên" },
                            { icon: FlaskConical, title: "R&D tiên tiến", text: "Nghiên cứu ứng dụng khoa học công nghệ nhằm cải tiến sản phẩm, thân thiện môi trường hơn.", stat: "∞", statLabel: "Đổi mới" },
                        ].map((item, i) => (
                            <RevealOnScroll key={i} delay={i * 0.15}>
                                <div className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/30 transition-all h-full group overflow-hidden">
                                    {/* Background number */}
                                    <span className="absolute -top-4 -right-2 text-[80px] font-black text-white/[0.03] group-hover:text-primary/[0.06] transition-colors leading-none">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                                <item.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <span className="text-primary font-black text-xl">{item.stat}</span>
                                                <span className="text-white/30 text-[9px] uppercase tracking-wider block">{item.statLabel}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black uppercase mb-3">{item.title}</h3>
                                        <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ 7. FLIP CARD VALUES ═══ */}
            <section className="py-20 lg:py-28 bg-white/[0.02] border-t border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <RevealOnScroll>
                        <p className="text-center text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-4">DNA</p>
                        <h2 className="text-2xl lg:text-4xl font-black uppercase tracking-tight mb-4 text-center">
                            Giá trị <span className="shimmer-text">cốt lõi</span>
                        </h2>
                        <p className="text-white/30 text-center text-xs mb-12">Hover hoặc chạm để khám phá</p>
                    </RevealOnScroll>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <RevealOnScroll key={i} delay={i * 0.15}>
                                <FlipCard value={v} index={i} />
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

/* ──────────────────────────────────────────── */
/*  FLOATING PARTICLES                          */
/* ──────────────────────────────────────────── */
function FloatingParticles() {
    const [particles, setParticles] = useState<any[]>([])

    useEffect(() => {
        // Generate particles only on client to avoid hydration mismatch
        const generatedParticles = Array.from({ length: 20 }).map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            durationY: 3 + Math.random() * 4,
            distanceY: 30 + Math.random() * 60,
            distanceX: (Math.random() - 0.5) * 40,
            scale: 1 + Math.random(),
            delay: Math.random() * 3,
        }))
        setParticles(generatedParticles)
    }, [])

    return (
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-primary/30"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                    }}
                    animate={{
                        y: [0, -particle.distanceY, 0],
                        x: [0, particle.distanceX, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0, particle.scale, 0],
                    }}
                    transition={{
                        duration: particle.durationY,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

/* ──────────────────────────────────────────── */
/*  BRAND MARQUEE                               */
/* ──────────────────────────────────────────── */
function BrandMarquee() {
    const doubled = [...brands, ...brands, ...brands]
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: [0, -1200] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {doubled.map((brand, i) => (
                    <span key={i} className="text-white/10 text-2xl lg:text-3xl font-black uppercase tracking-wider">
                        {brand}
                        <span className="text-primary/20 mx-6">●</span>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}

/* ──────────────────────────────────────────── */
/*  GLOWING DIVIDER                             */
/* ──────────────────────────────────────────── */
function GlowDivider() {
    return (
        <div className="relative h-px mx-auto max-w-7xl px-6 lg:px-8">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />
        </div>
    )
}

/* ──────────────────────────────────────────── */
/*  CIRCULAR COUNTER                            */
/* ──────────────────────────────────────────── */
function CircularCounter({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [count, setCount] = useState(0)
    const maxVal = stat.value <= 100 ? 100 : stat.value
    const progress = count / maxVal

    useEffect(() => {
        if (!isInView) return
        const duration = 2000
        const steps = 60
        const increment = stat.value / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= stat.value) {
                setCount(stat.value)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, duration / steps)
        return () => clearInterval(timer)
    }, [isInView, stat.value])

    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference * (1 - Math.min(progress, 1))

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, ease: "easeOut" }}
            className="text-center group"
        >
            <div className="relative w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <motion.circle
                        cx="50" cy="50" r={radius} fill="none"
                        stroke="url(#goldGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={isInView ? { strokeDashoffset } : {}}
                        transition={{ duration: 2, delay: delay + 0.3, ease: "easeOut" }}
                    />
                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="100%" stopColor="#ffecb3" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl lg:text-3xl font-black text-primary tabular-nums">{count.toLocaleString()}{stat.suffix}</span>
                </div>
            </div>
            <div className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
        </motion.div>
    )
}

/* ──────────────────────────────────────────── */
/*  REVEAL ON SCROLL                            */
/* ──────────────────────────────────────────── */
function RevealOnScroll({ children, direction = "up", delay = 0 }: { children: React.ReactNode; direction?: "up" | "left" | "right"; delay?: number }) {
    const initial = direction === "left" ? { opacity: 0, x: -60 } : direction === "right" ? { opacity: 0, x: 60 } : { opacity: 0, y: 40 }
    const animate = direction === "left" || direction === "right" ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }

    return (
        <motion.div initial={initial} whileInView={animate} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
            {children}
        </motion.div>
    )
}

/* ──────────────────────────────────────────── */
/*  QUOTE SECTION                               */
/* ──────────────────────────────────────────── */
function QuoteSection() {
    const words = "Chúng tôi tin tưởng sẽ đáp ứng được tất cả các nhu cầu đa dạng về sản phẩm dầu mỡ nhờn, hóa chất của người tiêu dùng cũng như các ngành công nghiệp.".split(" ")

    return (
        <section className="py-28 lg:py-40 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.6 }}
                    className="text-primary text-7xl lg:text-9xl font-black opacity-15 mb-8 select-none"
                >
                    &ldquo;
                </motion.div>
                <p className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold leading-snug lg:leading-snug">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0.08, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                        >
                            {word}{" "}
                        </motion.span>
                    ))}
                </p>
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="mt-10 inline-flex items-center gap-3 text-white/30 text-sm font-bold uppercase tracking-[0.2em]"
                >
                    <span className="w-8 h-px bg-primary/40" />
                    Marshell Vietnam
                    <span className="w-8 h-px bg-primary/40" />
                </motion.div>
            </div>
        </section>
    )
}

/* ──────────────────────────────────────────── */
/*  TIMELINE PIPE                               */
/* ──────────────────────────────────────────── */
function TimelinePipe() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] })
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

    return (
        <div ref={ref} className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 lg:-translate-x-px">
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute inset-0 bg-gradient-to-b from-primary via-primary/80 to-primary/40 rounded-full" />
            <motion.div style={{ scaleY, transformOrigin: "top" }} className="absolute inset-0 bg-primary/40 rounded-full blur-md" />
        </div>
    )
}

/* ──────────────────────────────────────────── */
/*  TIMELINE ITEM                               */
/* ──────────────────────────────────────────── */
function TimelineItem({ item, index }: { item: typeof timeline[0]; index: number }) {
    const isRight = item.side === "right"

    return (
        <div className={`relative pl-12 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-12 ${index > 0 ? "mt-8 lg:mt-0" : ""}`}>
            <div className="absolute left-2.5 lg:left-1/2 lg:-translate-x-1/2 top-0 z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="relative"
                >
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-black shadow-lg shadow-primary/30" />
                    <div className="absolute inset-0 rounded-full bg-primary/50 animate-ping" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`${isRight ? "lg:col-start-2" : "lg:col-start-1"} ${isRight ? "lg:text-left" : "lg:text-right"}`}
            >
                <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/20 transition-all ${isRight ? "" : "lg:ml-auto"} max-w-md group`}>
                    <span className="text-primary text-xs font-black uppercase tracking-[0.2em]">{item.year}</span>
                    <h3 className="text-lg font-black uppercase mt-1 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
                </div>
            </motion.div>
        </div>
    )
}

/* ──────────────────────────────────────────── */
/*  FLIP CARD                                   */
/* ──────────────────────────────────────────── */
function FlipCard({ value, index }: { value: typeof values[0]; index: number }) {
    const [flipped, setFlipped] = useState(false)

    return (
        <div
            className="perspective-1000 h-52 lg:h-60 cursor-pointer"
            onClick={() => setFlipped(!flipped)}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
        >
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative w-full h-full"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front */}
                <div className="absolute inset-0 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-5 backface-hidden hover:border-primary/20 transition-colors">
                    <span className="absolute top-4 right-5 text-5xl font-black text-white/[0.03]">{String(index + 1).padStart(2, "0")}</span>
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
                        <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-wide">{value.front}</h3>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30 flex items-center justify-center p-8 text-center backface-hidden"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <div>
                        <value.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                        <p className="text-white/80 text-sm leading-relaxed">{value.back}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
