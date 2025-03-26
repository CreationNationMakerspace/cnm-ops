/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['jjtuiaqdscwmimayyhlf.supabase.co'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  }
};

module.exports = nextConfig; 