/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com", // Allow images from Cloudinary
      "example.com",        // Allow example.com for placeholders
      "localhost",          // Allow localhost for local development
      "127.0.0.1",        // Allow localhost IP
      "eycmekevmpjgnchctrsa.supabase.co", // Allow Supabase storage
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'eycmekevmpjgnchctrsa.supabase.co', // Allow Supabase storage via remotePatterns
      },
    ],
  },
};

export default nextConfig;
