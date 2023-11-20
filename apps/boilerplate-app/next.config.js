/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  distDir: 'build-next-static',
  swcMinify: true,
  reactStrictMode: true,
  env: {
    BACKEND: 'http://localhost:3000/api/v1',
  },
};

module.exports = nextConfig;
