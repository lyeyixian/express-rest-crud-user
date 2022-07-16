module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module"
  },
  ignorePatterns: [
    "lib/*", // Ignore built files.
    "node_modules/*"
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "indent": ["error", 2, { "VariableDeclarator": 1 }],
    "import/no-unresolved": 0,
  },
};
