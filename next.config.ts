import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["minio.nextar.uno"],
  },
  output: "standalone",
};

export default nextConfig;
