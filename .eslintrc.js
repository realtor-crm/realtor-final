module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: [
      "./packages/frontend/tsconfig.json",
      "./packages/backend/tsconfig.json",
    ],
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    ".eslintrc.js",
    "commitlint.config.js",
    "lint-staged.config.js",
    ".prettierrc.js",
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "no-console": "warn",
    "prefer-const": "warn",
  },
  overrides: [
    {
      files: ["packages/frontend/**/*"],
      rules: {
        // Add frontend-specific rules here
      },
    },
    {
      files: ["packages/backend/**/*"],
      rules: {
        // Add backend-specific rules here
      },
    },
  ],
};
