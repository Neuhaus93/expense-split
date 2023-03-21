module.exports = {
    env: {
        es6: true,
        browser: true,
        jest: true,
        node: true,
    },
    parserOptions: {
        ecmaVersion: 2022,
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true,
        },
        sourceType: "module",
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:react/jsx-runtime",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react-refresh"],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "react/prop-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react-refresh/only-export-components": "warn",
    },
};
