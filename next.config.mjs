/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,

			'@features': path.resolve(process.cwd(), 'src', 'features'),
			'@app': path.resolve(process.cwd(), 'src', 'app'),
			'@tests': path.resolve(process.cwd(), 'src', 'tests'),
		};
		return config;
	},
	reactStrictMode: true,
	transpilePackages: ['@gisatcz/ptr-fe-core'],
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	experimental: {
		optimizePackageImports: [
			'@mantine/core',
			'@mantine/hooks',
			'@tabler/icons-react',
			'@deck.gl/core',
			'@deck.gl/react',
			'@deck.gl/layers',
			'@deck.gl/geo-layers',
		],
		webpackMemoryOptimizations: true,
	},
};

export default nextConfig;
