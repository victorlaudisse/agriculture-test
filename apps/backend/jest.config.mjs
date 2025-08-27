const config = {
  rootDir: "./",
  modulePaths: ["<rootDir>"],
  displayName: "backend",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  setupFiles: ["dotenv/config"],
  clearMocks: true,
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: ["src/**/*.(t|j)s", "!src/main.ts", "!src/**/index.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
