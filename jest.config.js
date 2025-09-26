const nextJest = require('next/jest');

const createJestConfig = nextJest({
   // Provide the path to your Next.js app to load next.config.js and .env files
   dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
   moduleNameMapper: {
      // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
      '^@/(.*)$': '<rootDir>/$1',
      // Mock next-intl to avoid ES module issues
      '^next-intl$': '<rootDir>/__mocks__/next-intl.ts',
   },
   testEnvironment: 'jest-environment-jsdom',
   testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
   transformIgnorePatterns: ['node_modules/(?!(next-intl)/)'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
