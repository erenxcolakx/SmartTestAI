/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle canvas dependency for pdf-parse
    config.resolve.alias.canvas = false;
    
    // Ignore problematic test files
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(canvas|jsdom)$/,
      })
    );

    // Handle fs module for client-side
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  
  // Updated config for Next.js 15
  serverExternalPackages: ['pdf-parse', 'mammoth'],
};

module.exports = nextConfig; 