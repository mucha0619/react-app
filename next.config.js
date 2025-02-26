/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-lostark.game.onstove.com'],
  },
  eslint: {
    // 빌드 시 ESLint 검사 비활성화
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 타입 검사 비활성화
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
