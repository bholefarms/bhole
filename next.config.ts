import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-src 'self' https://www.google.com; worker-src blob:;",
  },
];

const nextConfig: NextConfig = {
  // Enable standalone output for Docker (minimal production image)
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Include Prisma generated files in the standalone trace
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/**/*", "./prisma/**/*"],
  },

  // Skip i18n localization (not needed)
  i18n: undefined,

  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
