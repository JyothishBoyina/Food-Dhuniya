/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    main: '#f97316', // orange-500
                    light: '#fdba74', // orange-300
                    dark: '#c2410c', // orange-700
                },
                secondary: {
                    main: '#1e293b', // slate-800
                }
            }
        },
    },
    plugins: [],
}
