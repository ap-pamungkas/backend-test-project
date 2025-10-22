export default {
  testEnvironment: 'node',
  transform: {},

  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/jest.config.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};