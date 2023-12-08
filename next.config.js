/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  devIndicators: {
    buildActivity: false,
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
