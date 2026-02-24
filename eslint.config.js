export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                document: "readonly",
                window: "readonly",
                localStorage: "readonly",
                location: "readonly",
                history: "readonly",
                fetch: "readonly",
                console: "readonly",
                URL: "readonly",
                HTMLElement: "readonly",
                Event: "readonly",
                Date: "readonly",
                IntersectionObserver: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-undef": "error",
            "no-redeclare": "error",
            "eqeqeq": "off",
            "no-constant-condition": "error"
        }
    },
    {
        ignores: ["node_modules/"]
    }
];
