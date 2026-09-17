import type { NextConfig } from "next";

// Applied to every route (HTML pages + API routes)
const securityHeaders = [
  // Prevent browsers from MIME-sniffing a response away from the declared Content-Type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Refuse to be framed by any origin — prevents clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Force HTTPS for 2 years, include subdomains, eligible for preload list
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Limit referrer to origin-only for cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Block access to camera/mic/geo/payment — this app needs none of them
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Enable DNS prefetching for performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    // Next.js App Router requires 'unsafe-inline' for its own hydration scripts.
    // All other origins are locked down to exactly what this app uses client-side.
    value: [
      "default-src 'self'",
      // Next.js injects inline scripts for RSC and hydration.
      // React dev mode requires eval() for call-stack reconstruction — safe to allow in dev only.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ""}`,
      // Tailwind classes are applied inline; Google Fonts stylesheet
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Self-hosted Geist fonts (Next.js font optimization); Google font files fallback
      "font-src 'self' https://fonts.gstatic.com",
      // Inline SVGs and data URIs only
      "img-src 'self' data:",
      // API routes are same-origin — no external connect needed
      "connect-src 'self'",
      // No frames, no objects, no embeds
      "frame-src 'none'",
      "object-src 'none'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
