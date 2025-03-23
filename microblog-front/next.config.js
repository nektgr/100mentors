/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  // Allow connections from all hosts
  webpack: (config) => {
    return config;
  },
  // This is important for Docker
  webpackDevMiddleware: (config) => {
    // Required for HMR to work inside Docker
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
}

module.exports = nextConfig
