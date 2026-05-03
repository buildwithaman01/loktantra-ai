import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)"],
  moduleNameMapper: {
    "^isomorphic-dompurify$": "<rootDir>/__mocks__/isomorphic-dompurify.js"
  }
};

export default createJestConfig(config);
