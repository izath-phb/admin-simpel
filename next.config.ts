/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: ['192.168.18.10', 'localhost', '127.0.0.1'],
};

export default nextConfig;
