/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      fontFamily: {
        principal : ["Luckiest Guy", "cursive"],
        poppins : ["Poppins", "sans-serif"]
      },
      screens: {
        'xxs': '400px',
        
      },
      colors: {
        indigo: {
          50: '#f0f5ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
        },
        purple: {
          500: '#a855f7',
          600: '#9333ea',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
        },
        indigo: {
          50: '#f0f5ff',
          100: '#e0e7ff',
          600: '#4f46e5',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          600: '#d97706',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          600: '#059669',
        },
      }
    },
  },
  plugins: [],
}
