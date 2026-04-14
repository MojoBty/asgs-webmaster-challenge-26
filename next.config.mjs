/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
    ],
  },

  basePath: '/asgs-webmaster-challenge-26',
  assetPrefix: '/asgs-webmaster-challenge-26/',
}

export default nextConfig