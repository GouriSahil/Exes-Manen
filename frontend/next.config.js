/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*", // Proxy to Backend
      },
    ];
  },
  allowedDevOrigins: ["0.0.0.0", "192.168.29.141"],
  serverExternalPackages: ["pg", "drizzle-orm"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("pg-native");
    }
    return config;
  },
};

module.exports = nextConfig