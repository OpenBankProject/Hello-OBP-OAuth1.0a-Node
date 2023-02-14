module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    semi: [2, "always"],
    quotes: [2, "double", { avoidEscape: true }],
  },
  plugins: ["jest"],
  env: {
    "jest/globals": true,
  },
};
