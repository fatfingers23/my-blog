// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/content",
        "@nuxtjs/tailwindcss",
        "@nuxt/image",
        "@nuxt/eslint"],

    components: {
        global: true,
        dirs: ["~/components"],
    },
    content: {
        // https://content.nuxtjs.org/api/configuration
        highlight: {
            // Theme used in all color schemes.

            // OR
            theme: {
                // Default theme (same as single string)
                default: "github-dark",
                // Theme used if `html.dark`
                dark: "github-dark",
                light: "github-light",
                // Theme used if `html.sepia`
                sepia: "monokai"
            }
        }
    },
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
        }
    }
});
