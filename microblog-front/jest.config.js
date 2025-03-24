const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Handle case-sensitivity in Button imports - direct all to our mock
    '\\.\\./components/ui/button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./ui/button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./\\.\\./components/ui/button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./\\.\\./\\.\\./components/ui/button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./components/ui/Button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./ui/Button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./\\.\\./components/ui/Button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    '\\.\\./\\.\\./\\.\\./components/ui/Button$': '<rootDir>/tests/mocks/componentMocks.tsx',
    // Mock the cn utility
    '\\.\\./\\.\\./lib/utils': '<rootDir>/tests/mocks/lib.mock.tsx',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'context/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
