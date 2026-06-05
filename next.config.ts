import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this directory to avoid lockfile-ambiguity warnings
    root: __dirname,
  },
};

export default nextConfig;
