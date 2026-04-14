/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/asgs-webmaster-challenge-26',
  },

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