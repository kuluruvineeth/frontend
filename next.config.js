/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
