import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false
  },
  // Configure how pages are handled during build
  output: 'standalone',
  // Ensure admin page is handled as dynamic route
  pageExtensions: ['tsx', 'ts', 'jsx', 'js']
};

export default nextConfig;