import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // Gamle sider der er fjernet. 301-redirect for at bevare SEO-værdi.
      // /digital-design/ ranker pos 9-10 på "digitalt design bureau"
      // (1.329 visninger/md, 0 klik). Sendes til ui-ux-design som er
      // det semantisk tætteste match.
      {
        source: "/digital-design",
        destination: "/services/ui-ux-design",
        permanent: true,
      },
      {
        source: "/digital-design/:path*",
        destination: "/services/ui-ux-design",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
