/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.notion.so" },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      { protocol: "https", hostname: "**.amazonaws.com" }, // general S3-style URLs
      { protocol: "https", hostname: "images.unsplash.com" }, // optional
    ],
  },
};

export default nextConfig;
