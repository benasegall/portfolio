/** @type {import('next').NextConfig} */
const nextConfig = {
  // vitrine's one-pass measure logic fights StrictMode's dev double-invoke
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  agentRules: false,
}

export default nextConfig
