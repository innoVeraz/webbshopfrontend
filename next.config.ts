import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "webbshopbackend.vercel.app",
        port: "",
        pathname: "/public/**",
      }
    ],
  },
};

export default nextConfig;
