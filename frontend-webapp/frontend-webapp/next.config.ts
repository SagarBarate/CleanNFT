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
};

export default nextConfig;
