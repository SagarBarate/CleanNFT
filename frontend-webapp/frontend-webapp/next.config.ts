import type { NextConfig } from "next";
import { resolve } from "path";

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
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {
    // Set root to fix workspace detection issue with multiple lockfiles
    // This points to the current project directory
    root: process.cwd(),
  },
};

export default nextConfig;
