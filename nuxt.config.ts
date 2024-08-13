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

    },
    // app: {
    //     head: {
    //         charset: "utf-8",
    //         viewport: "width=device-width, initial-scale=1",
    //     }
    // }
});
