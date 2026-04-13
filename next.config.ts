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
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // unsafe-eval required for Strudel transpiler (uses eval)
            value:
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
