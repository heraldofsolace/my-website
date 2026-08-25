import type { NextConfig } from "next";

const strapiUrl = new URL(process.env.STRAPI_URL ?? "http://localhost:1337");

const nextConfig: NextConfig = {
  images: {
    // Local Strapi dev servers are usually reached over a raw local IP
    // (e.g. 127.0.0.1) — Next 16 blocks optimizing those by default as a
    // security measure. Safe here: this only takes effect when the
    // configured remote hostname above actually is a local IP, which in
    // practice only happens in dev (production STRAPI_URL is a real host).
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons",
      },
      // Some existing post/blog-portfolio content was migrated from the
      // production Strapi instance and still has absolute image URLs
      // pointing at it (rich-text body images, in particular) — allow
      // those to render even when developing against a local Strapi.
      {
        protocol: "https",
        hostname: "strapi-production-410d.up.railway.app",
      },
    ],
  },
  // Easter egg for anyone poking at the Network tab — see ConsoleEgg.tsx
  // for the console-side equivalent (whoami()/hire()).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Are-You-Hiring",
            value: "Probably. Try whoami() in the console.",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
