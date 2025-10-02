/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  devIndicators: false,
  images: {
    remotePatterns: [new URL("https://r2.ras.sh/**")],
  },
};

export default nextConfig;
