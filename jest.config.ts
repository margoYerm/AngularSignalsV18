import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', //typeScript
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  // rootDir: '.',
  //explicitly : TypeScript → ts-jest
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }]
  },
  roots: ['<rootDir>/server'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json'
    }
  }
};

export default config;