/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/login",
      permanent: false,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "****",
      },
    ],
  },
};

export default nextConfig;
