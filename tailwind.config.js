/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./content/**/*.md"
    ],
    plugins: [
        require("daisyui"),
        require("@tailwindcss/typography"),
    ],
};

