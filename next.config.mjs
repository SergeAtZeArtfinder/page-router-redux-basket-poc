import mod from "./next-i18next.config.js";
const { i18n } = mod;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "plus.unsplash.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "loremflickr.com",
      },
      {
        hostname: "picsum.photos",
      },
    ],
  },
  i18n,
};

export default nextConfig;
