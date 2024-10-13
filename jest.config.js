/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  preset: "ts-jest",
  globalSetup: "<rootDir>/test/utils/setups/globalSetup.ts",
  globalTeardown: "<rootDir>/test/utils/setups/globalTeardown.ts",
  setupFilesAfterEnv: [
    "<rootDir>/test/utils/setups/setupFile.ts"
  ]
};