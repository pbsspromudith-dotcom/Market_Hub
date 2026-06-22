import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - allowedDevOrigins is required by Next.js dev server for network access but might not be in the types yet
  allowedDevOrigins: ["192.168.1.100"],
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
};

export default nextConfig;
