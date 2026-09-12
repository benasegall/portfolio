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
  // The gated image route reads private/images at runtime, and files read that
  // way are not traced into the deployed function automatically — without this
  // every private image would 404 once deployed. Keys are route globs, so `**`
  // stands in for the literal [slug] and [name] brackets.
  outputFileTracingIncludes: {
    '/api/case-study/**': ['./private/images/**/*'],
  },
  agentRules: false,
}

export default nextConfig
