"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useScroll, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Volume2, VolumeX } from "lucide-react"
import { sendGAEvent } from '@next/third-parties/google';

import { Parallax } from "@/components/parallax"
import { Reveal } from "./reveal"
import { type HeroConfig } from "@/lib/hero"

export function HeroSection({ initialData }: { initialData: HeroConfig | null }) {
  const [config, setConfig] = useState<HeroConfig | null>(initialData)
  const [isMuted, setIsMuted] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const isOffScreenRef = useRef(false)

  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isFadingInRef = useRef(false)
  const userMutedRef = useRef(true)

  useEffect(() => {
    if (initialData && !config) {
        setConfig(initialData)
    }
  }, [initialData, config])

  useEffect(() => {
    userMutedRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!videoRef.current) return
      if (document.hidden) {
        videoRef.current.muted = true
      } else {
        videoRef.current.muted = userMutedRef.current
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const volumeMv = useMotionValue(0)
  const volumeSpring = useSpring(volumeMv, { stiffness: 50, damping: 20 })

  useMotionValueEvent(volumeSpring, "change", (latestVol) => {
    if (videoRef.current && !isMuted) {
      const clamped = Math.max(0, Math.min(1, latestVol))
      videoRef.current.volume = clamped

      if (latestVol < 0.01 && isOffScreenRef.current) {
        if (!videoRef.current.paused) {
          videoRef.current.pause()
        }
      }
    }
  })

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!videoRef.current || !hasStarted) return

    if (isFadingInRef.current && latest > 0.05) {
      isFadingInRef.current = false
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current)
      }
    }

    if (isFadingInRef.current && latest <= 0.05) return

    let targetVolume = 1
    const startFade = 0.15
    const endFade = 0.95

    if (latest < startFade) {
      targetVolume = 1
    } else if (latest >= endFade) {
      targetVolume = 0
    } else {
      const progress = (latest - startFade) / (endFade - startFade)
      targetVolume = 1 - progress
    }

    volumeMv.set(targetVolume)

    if (latest >= 0.98) {
      isOffScreenRef.current = true
    } else {
      isOffScreenRef.current = false
      if (videoRef.current.paused) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => { })
        volumeMv.set(1)
      }
    }
  })

  useEffect(() => {
    const handleStartVideo = () => {
      if (videoRef.current) {
        videoRef.current.volume = 0
        videoRef.current.currentTime = 0
        videoRef.current.muted = false
        setIsMuted(false)
        setHasStarted(true)

        isFadingInRef.current = true

        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) playPromise.catch(() => { })

        let fadeVolume = 0
        fadeIntervalRef.current = setInterval(() => {
          if (!videoRef.current || !isFadingInRef.current) {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
            return
          }
          fadeVolume = Math.min(1, fadeVolume + 0.02)
          videoRef.current.volume = fadeVolume
          volumeMv.set(fadeVolume)

          if (fadeVolume >= 1) {
            isFadingInRef.current = false
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
          }
        }, 50)
      }
    }

    const handleVideoEnded = () => {
      if (videoRef.current) {
        videoRef.current.muted = true
        setIsMuted(true)
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => { })
      }
    }

    const videoEl = videoRef.current
    if (videoEl) {
      videoEl.addEventListener("ended", handleVideoEnded)
    }

    const timer = setTimeout(handleStartVideo, 300)

    return () => {
      clearTimeout(timer)
      if (videoEl) {
        videoEl.removeEventListener("ended", handleVideoEnded)
      }
    }
  }, [])


  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Use defaults if config not yet loaded to prevent layout shift
  const title1 = config?.title1 || "Dầu nhớt"
  const title2 = config?.title2 || "Công nghiệp"
  const title3 = config?.title3 || "Chất lượng cao"
  const exp = config?.experience || "+ 15 Năm Kinh Nghiệm"
  const desc = config?.description || "Đối tác tin cậy cung cấp giải pháp bôi trơn toàn diện cho động cơ Diesel, xe tải và tàu thuyền tại Miền Bắc."
  const vidUrl = config?.videoUrl || "/input.mp4"

  return (
    <section ref={containerRef} className="relative h-[100svh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-[1] opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }} />
      </div>

      <div className="absolute inset-0 z-0 select-none bg-black">
        <Parallax offset={0} speed={0.5} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          {vidUrl && (
            vidUrl.match(/\.(mp4|webm)$/i) ? (
              <video
                ref={videoRef}
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover opacity-80"
              >
                <source src={vidUrl} type="video/mp4" />
              </video>
            ) : (
              <Image 
                src={vidUrl} 
                alt="Hero Background" 
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-80" 
              />
            )
          )}
        </Parallax>

        <div className="absolute inset-0 z-30 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-20 z-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      <div className="absolute bottom-10 right-10 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className="rounded-full bg-black/20 backdrop-blur-md border-white/10 hover:bg-white/10 text-white"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-48 pb-32 lg:pt-56 lg:pb-40">
        <div className="max-w-4xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 mb-8 rounded-full">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                {exp}
              </span>
            </div>
          </Reveal>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white leading-[1.2] uppercase mb-8 py-2">
            <Reveal>
              <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 pb-2">{title1}</span>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="block text-white pb-2">{title2}</span>
            </Reveal>
            <Reveal delay={0.2}>
              <span className="block text-primary pb-2">{title3}</span>
            </Reveal>
          </h1>

          <Reveal delay={600}>
            <div className="flex items-center gap-6 my-10">
              <div className="h-px flex-1 max-w-[100px] bg-primary" />
              <p className="text-xl text-white/90 max-w-xl font-light leading-relaxed">
                {desc}
              </p>
            </div>
          </Reveal>

          <Reveal delay={800}>
            <div className="mt-10 flex flex-col sm:flex-row gap-5">
              <Link href="/san-pham">
                <Button 
                  size="lg" 
                  onClick={() => sendGAEvent('event', 'click', { event_category: 'engagement', event_label: 'hero_check_products' })}
                  className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary/90 text-black text-base font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300"
                >
                  Xem sản phẩm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/lien-he">
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => sendGAEvent('event', 'click_nut_lien_he', { source: 'hero_main' })}
                  className="w-full sm:w-auto h-14 px-8 border-white/20 hover:bg-white/10 text-white hover:text-white hover:border-white/40 text-base font-bold uppercase tracking-wider rounded-full backdrop-blur-sm transition-all duration-300"
                >
                  Liên hệ ngay
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[20%] z-0 pointer-events-none">
          <Parallax offset={-50} speed={0.5}>
            <div
              className="text-[150px] font-black text-transparent whitespace-nowrap rotate-90 origin-center select-none"
              style={{ WebkitTextStroke: "2px rgba(255, 255, 255, 0.15)" }}
            >
              MARSHELL
            </div>
          </Parallax>
        </div>
      </div>
    </section>
  )
}
