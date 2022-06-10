module.exports = {
  extends: [
    "@agrimetrics/eslint-config-ts-agri",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [],
};
