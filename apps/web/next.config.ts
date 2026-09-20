import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for deployment to Cloudflare Pages (see apps/web/README.md).
  output: "export",
};

export default nextConfig;
