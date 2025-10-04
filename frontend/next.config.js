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
};

module.exports = nextConfig