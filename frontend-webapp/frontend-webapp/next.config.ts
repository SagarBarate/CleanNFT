import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Client-side only app - no server functions needed
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Transpile framer-motion to fix ES module compatibility issues
  transpilePackages: ["framer-motion", "motion-dom", "motion-utils"],
  // Webpack configuration to handle ES modules properly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Turbopack configuration (empty for now - using webpack)
  // This silences the warning about webpack config with Turbopack
  turbopack: {
    // Set root directory to fix workspace detection issue with multiple lockfiles
    root: process.cwd(),
  },
};

export default nextConfig;
