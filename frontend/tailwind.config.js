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
        'popup-grey': '#444343',
        'text-grey': '#F2F2F2',
        'blurred-grey': '#9B9B9B',
        'green-gradient': {
          100: '#0A1B34',
          200: '#0C372A',
          300: '#369C7E',
        },
        'card-green': '#52797E',
        'card-grey': '#6C7272',
        'card-view-grey': '#8F9595',
      },
    },
  },
};
