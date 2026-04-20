"use client"

import React, { useState, useRef } from "react"
import { UploadCloud, Loader2, X, Image as ImageIcon } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  acceptVideo?: boolean
}

export function ImageUpload({ value, onChange, disabled, className = "", placeholder = "Tải ảnh lên", acceptVideo = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Quick validation
    if (acceptVideo) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error("Vui lòng chọn định dạng hình ảnh hoặc video hợp lệ")
        return
      }
    } else {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn định dạng hình ảnh hợp lệ (JPG, PNG, WebP...)")
        return
      }
    }

    // Limit ~ 50MB for video, 5MB for image
    const maxSize = acceptVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`Kích thước tệp quá lớn. Vui lòng chọn tệp dưới ${acceptVideo ? '50MB' : '5MB'}`)
      return
    }

    try {
      setIsUploading(true)
      const data = await uploadToCloudinary(file)
      onChange(data.secure_url)
      toast.success("Tải ảnh lên thành công!")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Tải ảnh thất bại. Vui lòng thử lại.")
    } finally {
      setIsUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  const triggerUpload = () => {
    if (disabled || isUploading) return
    inputRef.current?.click()
  }

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled || isUploading) return
    onChange("")
  }

  return (
    <div className={`relative group ${className}`}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <div 
          className="relative w-full h-32 rounded-xl border-2 border-dashed border-white/20 bg-white/5 overflow-hidden group-hover:border-primary/50 transition-colors"
        >
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 rounded-md bg-black/50 border-white/10 hover:bg-black/80" 
                onClick={triggerUpload}
            >
                <ImageIcon className="w-3.5 h-3.5" />
            </Button>
            <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-7 w-7 rounded-md" 
                onClick={clearImage}
            >
                <X className="w-4 h-4" />
            </Button>
          </div>
          {value?.match(/\.(mp4|webm|ogg)$/i) ? (
            <video 
              src={value} 
              className="object-contain w-full h-full p-2 z-0" 
              autoPlay 
              loop 
              muted 
              playsInline 
            />
          ) : (
            <Image 
              src={value} 
              alt="Upload Preview" 
              fill 
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-contain p-2 z-0" 
              unoptimized 
            />
          )}
        </div>
      ) : (
        <div
          onClick={triggerUpload}
          className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            isUploading || disabled
              ? "border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
              : "border-white/20 bg-white/[0.02] hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs text-white/60 font-medium">Đang tải lên...</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs text-white/50 font-medium">{placeholder}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
