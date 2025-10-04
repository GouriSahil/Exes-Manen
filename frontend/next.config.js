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
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:8000",
    "http://192.168.29.141:3000",
    "http://192.168.29.141:8000",
  ],
  serverExternalPackages: ["pg", "drizzle-orm"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("pg-native");
    }
    return config;
  },
};

module.exports = nextConfig