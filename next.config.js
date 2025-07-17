/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  async rewrites() {
    return [
      // Multi-tenant routing - subdomain support
      {
        source: '/:path*',
        destination: '/tenant/:path*',
        has: [
          {
            type: 'host',
            value: '(?<tenant>.*)\\.localhost:3000',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig