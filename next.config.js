/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://searchspaces.store/:path*',
      },
    ];
  },
  images: {
    domains: ['search.pstatic.net', 'ldb-phinf.pstatic.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'search.pstatic.net',
        pathname: '/common/**',
      },
      {
        protocol: 'https',
        hostname: 'ldb-phinf.pstatic.net',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
