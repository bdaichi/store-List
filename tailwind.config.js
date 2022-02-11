module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      inset: {
        '4/5': '80%',
        '9/10': '90%'
      },
      colors: {

        'text-default': '#454552',
        'bg-default': '#454552',


      }
    },
  },

  plugins: [

  ],
  corePlugins: {
    boxSizing: false,
  }
}