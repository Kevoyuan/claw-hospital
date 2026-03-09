/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                claw: {
                    base: '#09090b',
                    panel: '#18181b',
                    cyan: '#06b6d4',
                    rose: '#e11d48',
                    green: '#10b981',
                    dim: '#064e3b'
                }
            },
            fontFamily: {
                mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
                pixel: ['"Press Start 2P"', 'monospace']
            }
        },
    },
    plugins: [],
}
