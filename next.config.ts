import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Everything in this demo is client-side mock data, so Cache Components /
  // Partial Prefetching are left off to keep the routing model simple.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
