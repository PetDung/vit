"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Cog, Ship, Wrench, Cpu } from "lucide-react"

export default function LandingPageClient() {
  const router = useRouter()
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null)

  const handleSelect = (path: string) => {
    router.push(path)
  }

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-black select-none">
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px"
      }} />

      {/* Center logo */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="p-3 rounded-sm bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <Image
            src="/logo.png"
            alt="Marshell Logo"
            width={180}
            height={50}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </motion.div>

      {/* Center title */}
      <motion.div
        className="absolute top-28 left-1/2 -translate-x-1/2 z-50 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h1 className="text-xl md:text-2xl font-bold text-white/80 uppercase tracking-[0.3em]">
          Chọn Lĩnh Vực
        </h1>
        <p className="text-sm text-white/40 mt-2 tracking-wide">
          Vui lòng chọn chủ đề sản phẩm bạn quan tâm
        </p>
      </motion.div>

      <div className="relative h-full w-full flex">
        {/* ═══ LEFT PANEL — Dầu Cơ Khí ═══ */}
        <motion.div
          className="relative h-full cursor-pointer overflow-hidden group"
          animate={{
            width: hoveredSide === "left" ? "65%" : hoveredSide === "right" ? "35%" : "50%",
          }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => handleSelect("/dau-co-khi")}
        >
          {/* Gold gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1500] via-[#0d0b00] to-black" />
          
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: hoveredSide === "left"
                ? "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 70%)"
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Hazard stripe top */}
          <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{
            background: "repeating-linear-gradient(45deg, #FFD700, #FFD700 8px, transparent 8px, transparent 16px)"
          }} />

          {/* Decorative icons */}
          <div className="absolute top-1/4 left-1/4 opacity-5">
            <Cog className="w-64 h-64 text-[#FFD700]" strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-1/4 right-1/4 opacity-5">
            <Ship className="w-48 h-48 text-[#FFD700]" strokeWidth={0.5} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
            <motion.div
              animate={{
                scale: hoveredSide === "left" ? 1.1 : 1,
                opacity: hoveredSide === "right" ? 0.4 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#FFD700]/30 flex items-center justify-center bg-[#FFD700]/5 backdrop-blur-sm">
                <Wrench className="w-10 h-10 text-[#FFD700]" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-[#FFD700] uppercase tracking-wider mb-4">
                Dầu Cơ Khí
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-xs mx-auto leading-relaxed mb-8">
                Dầu nhớt công nghiệp, dầu thủy lực, dầu động cơ Diesel cho xe tải, tàu thuyền
              </p>

              {/* CTA */}
              <motion.div
                animate={{
                  opacity: hoveredSide === "left" ? 1 : 0,
                  y: hoveredSide === "left" ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2 text-[#FFD700] font-bold uppercase tracking-widest text-sm"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom hazard stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-1 z-10" style={{
            background: "repeating-linear-gradient(45deg, #FFD700, #FFD700 8px, transparent 8px, transparent 16px)"
          }} />
        </motion.div>

        {/* ═══ CENTER DIVIDER ═══ */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-30 flex items-center pointer-events-none">
          <motion.div
            className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
            animate={{
              x: hoveredSide === "left" ? 40 : hoveredSide === "right" ? -40 : 0,
              opacity: hoveredSide ? 0.5 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        {/* ═══ RIGHT PANEL — Dầu Máy CNC ═══ */}
        <motion.div
          className="relative h-full cursor-pointer overflow-hidden group"
          animate={{
            width: hoveredSide === "right" ? "65%" : hoveredSide === "left" ? "35%" : "50%",
          }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => handleSelect("/dau-cnc")}
        >
          {/* Blue gradient background */}
          <div className="absolute inset-0 bg-gradient-to-bl from-[#001a33] via-[#000a1a] to-black" />
          
          {/* Animated glow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: hoveredSide === "right"
                ? "radial-gradient(ellipse at 50% 50%, rgba(74,158,255,0.15) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 50% 50%, rgba(74,158,255,0.05) 0%, transparent 70%)"
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Blue stripe top */}
          <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{
            background: "repeating-linear-gradient(45deg, #4A9EFF, #4A9EFF 8px, transparent 8px, transparent 16px)"
          }} />

          {/* Decorative icons */}
          <div className="absolute top-1/4 right-1/4 opacity-5">
            <Cpu className="w-64 h-64 text-[#4A9EFF]" strokeWidth={0.5} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
            <motion.div
              animate={{
                scale: hoveredSide === "right" ? 1.1 : 1,
                opacity: hoveredSide === "left" ? 0.4 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#4A9EFF]/30 flex items-center justify-center bg-[#4A9EFF]/5 backdrop-blur-sm">
                <Cpu className="w-10 h-10 text-[#4A9EFF]" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-[#4A9EFF] uppercase tracking-wider mb-4">
                Dầu Máy CNC
              </h2>
              <p className="text-sm md:text-base text-white/60 max-w-xs mx-auto leading-relaxed mb-8">
                Dầu bôi trơn, dầu cắt gọt, dầu thủy lực chuyên dụng cho máy CNC gia công chính xác
              </p>

              {/* CTA */}
              <motion.div
                animate={{
                  opacity: hoveredSide === "right" ? 1 : 0,
                  y: hoveredSide === "right" ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-2 text-[#4A9EFF] font-bold uppercase tracking-widest text-sm"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom blue stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-1 z-10" style={{
            background: "repeating-linear-gradient(45deg, #4A9EFF, #4A9EFF 8px, transparent 8px, transparent 16px)"
          }} />
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-xs text-white/30 tracking-wider text-center">
          © {new Date().getFullYear()} Công ty TNHH Thành Lợi Marshell. Tất cả quyền được bảo lưu.
        </p>
      </motion.div>
    </main>
  )
}
