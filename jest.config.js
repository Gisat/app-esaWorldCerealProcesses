module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		'^@features/(.*)$': '<rootDir>/src/features/$1',
		'^@app/(.*)$': '<rootDir>/src/app/$1',
	},
};
