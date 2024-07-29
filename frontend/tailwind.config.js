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
        'card-green': '#52797E',
        'card-grey': '#6C7272',
        'card-view-grey': '#8F9595',
        'dark-grey': '#444343',
        'card-dark-green': '#385450',
        'valid-green': '#3CC639',
        'invalid-red': '#FA3636',
        'dropdown-grey': {
          100: '#8F9594',
          200: '#575959',
        },
      },
    },
    minHeight: {
      0: '0px',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      20: '5rem', // Example: 20 tailwind units
      40: '10rem', // Example: 40 tailwind units
      60: '60px', // Example: 60 tailwind units
      80: '20rem', // Example: 80 tailwind units
    },
  },
};
