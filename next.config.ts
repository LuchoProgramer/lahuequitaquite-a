import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir imágenes del backend de LedgerXpertz
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.ledgerxpertz.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // Configuración para deployment
  output: 'standalone',

  // Configuración experimental para mejor performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
