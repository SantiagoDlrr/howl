import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use 'jsdom' if testing code that runs in the browser
  transform: {
    '^.+\\.ts$': 'ts-jest', // Handles TypeScript files
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'], // Extensions Jest will recognize
  testMatch: ['**/unit-jest/**/*.test.ts'], // Pattern to find test files (adjust as necessary)
};

export default config;
