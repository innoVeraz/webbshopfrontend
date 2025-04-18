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
      new URL('https://webbshopbackend.vercel.app/public/**')
    ],
  },
};

export default nextConfig;
