/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,

      '@features': path.resolve(process.cwd(), 'src', "features"), 
      '@app': path.resolve(process.cwd(), 'src', "app"), 
      '@tests': path.resolve(process.cwd(), 'src', "tests"), 
    };
    return config;
  },
};

export default nextConfig;