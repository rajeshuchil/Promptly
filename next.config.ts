import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react", "framer-motion", "ogl"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    // Pin the workspace root to this directory to avoid lockfile-ambiguity warnings
    root: __dirname,
  },
};

export default nextConfig;
