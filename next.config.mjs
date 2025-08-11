// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: false, // ⛔️ Only do this for debugging!
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add your image domain here
    domains: [
      // Add the domain of your image service
      // For example, if using ImageKit:
      'ik.imagekit.io',
      // Add other domains as needed
    ],
    // Alternative: use remotePatterns for more control
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows all HTTPS domains (use specific domains in production)
        port: '',
        pathname: '**',
      },
    ],
    // Optional: minimize layout shift
    minimumCacheTTL: 60,
  },
  // Add headers to handle CORS if needed
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default  nextConfig;