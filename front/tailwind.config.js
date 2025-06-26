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
        
      }
    },
  },
  plugins: [],
}
