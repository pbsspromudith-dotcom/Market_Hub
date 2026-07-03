import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  // allowedDevOrigins: ["192.168.1.100"], // Only needed for local network testing in dev
};

export default nextConfig;
