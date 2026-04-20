/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      noTurbo: true,
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
