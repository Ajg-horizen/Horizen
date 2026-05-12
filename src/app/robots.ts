import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ikke-wordpress"],
      },
    ],
    sitemap: "https://horizen.dk/sitemap.xml",
    host: "https://horizen.dk",
  };
}
