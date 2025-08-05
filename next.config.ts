import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        hostname: "wp.salesforce.com",
      },
      {
        hostname: "b2b.herokuapps.ai",
      },
      {
        hostname: "b2b.commerce.butpurple.com",
      },
    ],
  },
  experimental: {
    useCache: true,
    cacheLife: {
      blog: {
        stale: 60 * 10,
        revalidate: 60 * 10,
        expire: 60 * 10,
      },
    },
  },
};

export default nextConfig;
