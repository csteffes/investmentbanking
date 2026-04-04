/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/assessment",
        destination: "/mock-interview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
