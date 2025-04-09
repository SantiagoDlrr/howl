/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",  // Point to your tsconfig.json for TypeScript settings
  },
  plugins: [
    "@typescript-eslint", // Include the @typescript-eslint plugin for TypeScript-specific rules
  ],
  extends: [
    "next/core-web-vitals",  // Next.js core web vitals rules
    "plugin:@typescript-eslint/recommended", // Recommended rules for TypeScript
    "plugin:@typescript-eslint/stylistic", // Add stylistic rules for TypeScript (check if this exists)
  ],
  rules: {
    "@typescript-eslint/array-type": "off", // Disable array-type rule
    "@typescript-eslint/consistent-type-definitions": "off", // Disable consistent type definitions rule
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports", // Use type imports
        "fixStyle": "inline-type-imports", // Inline type imports
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_", // Ignore unused variables with _ prefix
      },
    ],
    "@typescript-eslint/require-await": "off", // Disable require-await rule
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false, // Disable the check for void return in promises
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json", // Resolve TypeScript paths in ESLint
      },
    },
  },
};

module.exports = config;