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
};

export default nextConfig;
