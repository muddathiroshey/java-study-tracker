/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config) => {
    if (config.watchOptions && config.watchOptions.ignored) {
      const existing = config.watchOptions.ignored;
      if (existing instanceof RegExp) {
        config.watchOptions = {
          ...config.watchOptions,
          ignored: new RegExp(`db\\.json|${existing.source}`)
        };
      } else if (typeof existing === 'string') {
        config.watchOptions = {
          ...config.watchOptions,
          ignored: [existing, '**/db.json']
        };
      }
    } else {
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: '**/db.json'
      };
    }
    return config;
  }
};

export default nextConfig;
