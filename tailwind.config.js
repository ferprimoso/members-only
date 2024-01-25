/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs",
  "./views/partials/*.ejs",
  './public/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        deepblue: '#001233',
        lightcoralred: '#FF595A',
        beige: '#CAC0B3',
        lightbeige: '#FDF8F0',
        crimson: '#F0122D',
      },
     },
  },
  plugins: [],
}

