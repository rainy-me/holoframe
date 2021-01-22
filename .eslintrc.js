module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-strongly-recommended",
    "prettier",
    "prettier/vue",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "vue/require-prop-types": "off",
    "eslint-disable no-unused-vars": "off",
  },
};
