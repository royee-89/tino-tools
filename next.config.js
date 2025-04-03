/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 支持工具集成
  async rewrites() {
    return [
      {
        source: '/tools/:path*',
        destination: '/api/tools/:path*',
      },
    ]
  },
}

module.exports = nextConfig 