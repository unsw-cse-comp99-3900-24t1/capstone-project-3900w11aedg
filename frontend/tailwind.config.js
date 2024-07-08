module.exports = {
  content: ['./src/screens/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'theme-gold': '#C99F58',
        'dark-green': '#081715',
        'navbar-grey': '#495351',
        'button-grey': '#A7A7A7',
        'popup-grey': '#606665',
        'text-grey': '#F2F2F2',
        'green-gradient': {
          100: '#0A1B34',
          200: '#0C372A',
          300: '#369C7E',
        },
      },
    },
  },
};
