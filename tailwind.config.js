/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./assets/**/*.{vue,js,css}",
        "./components/**/*.{vue,js}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        //eslint-disable-next-line
        require('daisyui'),
    ],
};

