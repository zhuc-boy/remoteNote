module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "eslint:recommended"],
    rules: {
        "arrow-parens": 0,
        indent: [
            1,
            4,
            {
                SwitchCase: 1
            }
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                max: 5,
                maxBOF: 1,
                maxEOF: 1
            }
        ],
        "space-before-function-paren": 0,
        "spaced-comment": 0,
        "padded-blocks": 0,
        quotes: 0,
        "no-trailing-spaces": 0,
        "no-unused-vars": 1,
        camelcase: 0,
        "eol-last": 1,
        "import/first": 0,
        "no-multi-spaces": 0,
        "no-multiple-empty-lines": 0,
        "prefer-promise-reject-errors": 0,
        // allow async-await
        "generator-star-spacing": 0,
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};
