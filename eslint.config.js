import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,vue}"],
        rules: {
            semi: [2, "always"],
            quotes: ["error", "double"],
            "vue/max-attributes-per-line": [
                "error",
                {
                    singleline: {
                        max: 1
                    },
                    multiline: {
                        max: 1
                    }
                }
            ],
            "vue/html-indent": [
                "error",
                2,
                {
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    alignAttributesVertically: true
                }
            ]
        },
    },

    {
        languageOptions: {
            globals: globals.browser
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    {
        files: ["**/*.vue, **/*.ts"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser
            }
        },
    },
];
