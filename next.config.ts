import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["mongodb", "mongoose"],
};

export default nextConfig;