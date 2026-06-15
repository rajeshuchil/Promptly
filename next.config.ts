import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["lucide-react"],
  turbopack: {
    // Pin the workspace root to this directory to avoid lockfile-ambiguity warnings
    root: __dirname,
  },
};

export default nextConfig;
