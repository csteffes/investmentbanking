/** @type {import('next').NextConfig} */
const connectSources = [
  "'self'",
  "https://api.openai.com",
  "https://api.stripe.com",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_URL,
].filter(Boolean);

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  `connect-src ${connectSources.join(" ")}`,
  "media-src 'self' blob:",
  "frame-src https://js.stripe.com",
].join("; ");

const nextConfig = {
  async headers() {
    const securityHeaders = [
      {
        key: "Content-Security-Policy",
        value: csp,
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Permissions-Policy",
        value: "microphone=(self)",
      },
    ];

    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/assessment",
        destination: "/mock-interview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
