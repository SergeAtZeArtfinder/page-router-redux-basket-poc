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
  i18n: {
    locales: ["not-set", "en-GB", "en-US"],
    defaultLocale: "not-set", // This is on purpose, we don't want to set a default locale so we know when it's specified in the URL
    localeDetection: false,
  },
};

export default nextConfig;
