'use client'

import dynamic from 'next/dynamic'

// TipTap only needed in admin pages — lazy load it out of the main client bundle.
export const RichEditor = dynamic(
  () => import('./rich-editor').then(m => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-muted animate-pulse rounded-md flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Đang tải trình soạn thảo...</span>
      </div>
    ),
  }
)
