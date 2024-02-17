/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const headers = [
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000 ; includeSubDomains",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
    ];

    return [
      {
        source: "/",
        headers,
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },
};

module.exports = nextConfig;
