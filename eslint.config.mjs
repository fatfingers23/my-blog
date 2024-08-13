import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
export default createConfigForNuxt({


}).append({
    rules: {
        "no-undef": "off",
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
            "ignores": ["index","default", "[slug]"]
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
});
