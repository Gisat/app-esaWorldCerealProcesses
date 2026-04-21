/** @type {import('next').NextConfig} */
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const nextConfig = {

	output: 'standalone',
	// reactStrictMode: false,
	// transpilePackages: ['ptr-fe-core'],
	turbopack: {
		// resolveConditions: ['browser', 'module', 'main', 'import', 'default'],
		// root: path.resolve(__dirname, '..'),
		// resolveAlias: {
		// 	'@gisatcz/ptr-fe-core/': '../ptr-fe-core/src' + '/',
		// 	'@gisatcz/ptr-fe-core/styles': '../ptr-fe-core/src/client/styles.css',
		// 	'@mantine/core': './node_modules/@mantine/core',
		// 	'@mantine/charts': './node_modules/@mantine/charts',
		// 	'@deck.gl/core': './node_modules/@deck.gl/core',
		// 	'@deck.gl/extensions': './node_modules/@deck.gl/extensions',
		// 	'@deck.gl/layers': './node_modules/@deck.gl/layers',
		// 	'@deck.gl/react': './node_modules/@deck.gl/react',
		// 	'@deck.gl/geo-layers': './node_modules/@deck.gl/geo-layers',
		// 	axios: './node_modules/axios',
		// 	sqlite3: './node_modules/sqlite3',
		// },
	},


	webpack(config){
		// config.resolve.alias = {
		// 	...config.resolve.alias,
		//
		// 	'@features': path.resolve(process.cwd(), 'src', 'features'),
		// 	'@app': path.resolve(process.cwd(), 'src', 'app'),
		// 	'@tests': path.resolve(process.cwd(), 'src', 'tests'),
		// };
		return config;
	},
	// reactStrictMode: true,
	// transpilePackages: ['@gisatcz/ptr-fe-core'],
	// compiler: {
	// 	removeConsole: process.env.NODE_ENV === 'production',
	// },
	// experimental: {
	// 	optimizePackageImports: [
	// 		'@mantine/core',
	// 		'@mantine/hooks',
	// 		'@tabler/icons-react',
	// 		'@deck.gl/core',
	// 		'@deck.gl/react',
	// 		'@deck.gl/layers',
	// 		'@deck.gl/geo-layers',
	// 	],
	// 	webpackMemoryOptimizations: true,
	// },
};

export default nextConfig;
