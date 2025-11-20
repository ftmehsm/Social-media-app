import createNextIntlPlugin from 'next-intl/plugin';

// Configure next-intl plugin
// The plugin will automatically use the routing configuration
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/C:/Users/Asus/Application Data/**', // جلوگیری از EPERM
        // Ignore Windows system files (glob patterns work for root and nested)
        '**/hiberfil.sys',
        '**/pagefile.sys',
        '**/swapfile.sys',
        '**/DumpStack.log.tmp',
        'C:/hiberfil.sys',
        'C:/pagefile.sys',
        'C:/swapfile.sys',
        'C:/DumpStack.log.tmp',
      ],
    };
    
    // Exclude native modules from webpack processing for server-side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@node-rs/argon2': 'commonjs @node-rs/argon2',
      });
    }
    
    // Ignore .node files (native binaries) from webpack processing
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.node$/,
      use: {
        loader: 'ignore-loader',
      },
    });
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",  // UploadThing CDN
        pathname: "/**",  // Allow all paths
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",  // UploadThing subdomains (for backward compatibility)
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    // Use custom loader to bypass optimization for UploadThing URLs
    loader: "custom",
    loaderFile: "src/lib/imageLoader.ts",
  },
};

export default withNextIntl(nextConfig);
