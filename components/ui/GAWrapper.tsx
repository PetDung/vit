'use client'

import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function GAWrapper({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  // Nếu đường dẫn bắt đầu bằng "/admin", không render GA4
  if (pathname?.startsWith('/quan-ly')) {
    return null; 
  }
  return <GoogleAnalytics gaId={gaId} />;
}