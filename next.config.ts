import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Libera acesso via IP para desenvolvimento
  allowedDevOrigins: ['192.168.1.201', 'localhost'],
  // Se estiver usando turbopack, pode precisar também:
};

export default nextConfig;