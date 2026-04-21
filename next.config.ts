import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@strudel/core",
    "@strudel/codemirror",
    "@strudel/draw",
    "@strudel/transpiler",
    "@strudel/webaudio",
    "@strudel/mini",
    "@strudel/tonal",
  ],
  async headers() {
    const csp = [
      "default-src 'self'",
      // unsafe-eval is required for Strudel transpiler runtime
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' ws: wss: https://*.supabase.co https://api.anthropic.com https://api.groq.com https://raw.githubusercontent.com http://localhost:11434",
      "worker-src 'self' blob:",
      "media-src 'self' data: blob: https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
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
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
