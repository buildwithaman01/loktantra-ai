/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  experimental: {
    serverComponentsExternalPackages: ["isomorphic-dompurify"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "maps.gstatic.com" },
    ],
  },
  // Security: prevent information disclosure
  generateEtags: false,
};

module.exports = nextConfig;
