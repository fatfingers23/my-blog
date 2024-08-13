import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import {includeIgnoreFile} from "@eslint/compat";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
    includeIgnoreFile(gitignorePath),
    {
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
            "vue/multi-word-component-names": ["error", {
                "ignores": ["index","default"]
            }],
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
        files: [
            "./assets/**/*.{vue,js,css}",
            "./components/**/*.{vue,js}",
            "./layouts/**/*.vue",
            "./pages/**/*.vue",
            "./plugins/**/*.{js,ts}"
        ],
        ignores: ["node_modules/*", ".output/*"],
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
        files: [
            "./assets/**/*.{vue,js,css}",
            "./components/**/*.{vue,js}",
            "./layouts/**/*.vue",
            "./pages/**/*.vue",
            "./plugins/**/*.{js,ts}",],
        ignores: ["node_modules/*", ".output/*"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser
            }
        },

    },
];
