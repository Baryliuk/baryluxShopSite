import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.mydrop.com.ua',
        port: '',
        pathname: '/**', // Дозволяє будь-які шляхи на цьому домені
      },
    ],
  },
};

export default nextConfig;
