/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: 'export',
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
    unoptimized: true, // static export를 사용할 때는 이 설정이 필요합니다
  },
};

module.exports = nextConfig;
