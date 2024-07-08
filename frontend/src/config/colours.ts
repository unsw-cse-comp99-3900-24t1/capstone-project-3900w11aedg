import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Theme } from '@react-navigation/native';

// Add dark and light mode specific parameters here
interface ColourTheme extends Theme {
  colors: Theme['colors'] & {
    // navbar: string;
  };
}

const DarkColours: ColourTheme = {
  ...DarkTheme,
  colors: {
    primary: '',
    background: 'dark-green',
    card: '',
    text: 'white',
    border: '',
    notification: '',
  },
};

const LightColours: ColourTheme = {
  ...DefaultTheme,
  colors: {
    primary: '',
    background: 'neutral',
    card: '',
    text: 'text-grey',
    border: '',
    notification: '',
  },
};

export { ColourTheme, DarkColours, LightColours };
