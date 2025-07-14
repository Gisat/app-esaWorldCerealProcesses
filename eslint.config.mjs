import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

// Setup for FlatCompat (for legacy configs like eslint-config-next)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default defineConfig([
	// Global ignores or global configs
	{
		files: ['**/*.{js,ts,jsx,tsx}'],
		languageOptions: {
			globals: globals.browser,
		},
	},

	// JS and TS recommended
	js.configs.recommended,
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,

	// 👇 Add Next.js support via compat
	...compat.extends('next/core-web-vitals'),

	// Your custom rules
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@next/next/no-html-link-for-pages': 'off',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
]);
