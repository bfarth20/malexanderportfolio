/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable WebP/AVIF from the optimizer (optional but nice)
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Notion/S3
      { protocol: "https", hostname: "**.notion.so" },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "**.amazonaws.com" },

      // Stock/others you already had
      { protocol: "https", hostname: "images.unsplash.com" },

      // The artist-site CDN you pasted
      { protocol: "https", hostname: "lirp.cdn-website.com" },
      { protocol: "https", hostname: "irp.cdn-website.com" },
      // (optional catch-all if they change subdomains)
      { protocol: "https", hostname: "**.cdn-website.com" },
    ],
  },
};

export default nextConfig;
