/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  transpilePackages: ["@ras-sh/ui"],
  redirects() {
    return [
      {
        source: "/stack",
        destination: "https://www.npmjs.com/package/@ras-sh/stack",
        permanent: false,
      },
      {
        source: "/convex-cli",
        destination: "https://www.npmjs.com/package/@ras-sh/convex-cli",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
