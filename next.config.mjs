/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Fix symlink EPERM on Windows by using hardlinks instead of symlinks
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./db.json'],
    },
  },
}

export default nextConfig
