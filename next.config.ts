import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend.mydrop.com.ua',
        port: '',
        pathname: '/**', // Зображення товарів MyDrop
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Аватарки Google OAuth
      },
    ],
  },
};

export default nextConfig;