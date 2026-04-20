"use client"

import { useState, useRef } from "react"
import { UploadCloud, X, Loader2, ImagePlus } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloudinary"
import Image from "next/image"

interface MultiImageUploadProps {
    images: string[]
    onChange: (images: string[]) => void
    maxImages?: number
}

export function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return

        if (images.length + files.length > maxImages) {
            alert(`Chỉ được tải lên tối đa ${maxImages} ảnh!`)
            return
        }

        setUploading(true)

        try {
            const uploadPromises = files.map(file => uploadToCloudinary(file))
            const results = await Promise.all(uploadPromises)
            const newUrls = results.map(r => r.secure_url)
            onChange([...images, ...newUrls])
        } catch (err) {
            console.error("Lỗi upload Cloudinary", err)
            import("sonner").then(m => m.toast.error("Tải ảnh thất bại. Vui lòng thử lại."))
        }

        setUploading(false)
        
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeImage = (index: number) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        onChange(newArr)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((url, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20 bg-white/5 group">
                        <Image src={url} alt="Uploaded img" fill className="object-cover" />
                        <button 
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 hover:border-primary/50 flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
                        <span className="text-[10px] uppercase font-bold text-center leading-tight">
                            {uploading ? "Đang tải" : `Thêm ảnh (${images.length}/${maxImages})`}
                        </span>
                    </button>
                )}
            </div>

            <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange} 
            />
            {images.length > 0 && (
                <p className="text-xs text-white/40 italic">Ảnh đầu tiên sẽ được chọn làm ảnh đại diện chính của sản phẩm.</p>
            )}
        </div>
    )
}
