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
      // ─── Spøgelsessider fra før relancering (maj 2026) ─────────────
      // 301-redirects der bevarer SEO-værdi fra det gamle site.

      // /digital-design/ rankede pos ~10 på "digitalt design bureau"
      // (1.329 visninger/md). Sendes til ui-ux-design (semantisk match).
      { source: "/digital-design", destination: "/services/ui-ux-design", permanent: true },
      { source: "/digital-design/:path*", destination: "/services/ui-ux-design", permanent: true },

      // /hjemmeside/ rankede pos 3,26 (180 visninger). Var den gamle
      // webudvikling-side. Sendes til den nye service-side.
      { source: "/hjemmeside", destination: "/services/webudvikling", permanent: true },
      { source: "/hjemmeside/:path*", destination: "/services/webudvikling", permanent: true },

      // /branding/ rankede pos 9,85 (68 visninger). Sendes til den nye
      // branding-service. Samtidig flyttes /services/branding-logo til
      // /services/branding (kortere slug).
      { source: "/branding", destination: "/services/branding", permanent: true },
      { source: "/branding/:path*", destination: "/services/branding", permanent: true },
      { source: "/services/branding-logo", destination: "/services/branding", permanent: true },
      { source: "/services/branding-logo/:path*", destination: "/services/branding", permanent: true },
    ];
  },
};

export default nextConfig;
