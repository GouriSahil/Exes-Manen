/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*' // Proxy to Backend
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['pg', 'drizzle-orm']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pg-native');
    }
    return config;
  }
}

module.exports = nextConfig