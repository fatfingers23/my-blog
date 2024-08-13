// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxt/content",
        "@nuxtjs/tailwindcss",
        "@nuxt/image",
        "@nuxt/eslint"],
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => ["UseFetchDemo"].includes(tag),
        },
    },
    components: {
        global: true,
        dirs: ["~/components"],
    },
    content: {
        // https://content.nuxtjs.org/api/configuration
        highlight: {
            preload: ["javascript", "vue", "html"],
            theme: "monokai",
        },
    },
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
        }
    }
});
