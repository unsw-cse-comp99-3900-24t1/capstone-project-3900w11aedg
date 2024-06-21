import {DefaultTheme, DarkTheme} from '@react-navigation/native';

type ColourTheme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
};

// Not worried about proper light mode colours for sprint 1
// Colours can be changed accordingly in future
const sharedColours = {
  gold: '#C99F58',
  buttonGrey: '#A7A7A7',
  popupGrey: '#606665',
  navbarGrey: '#495351',
  gradient1: '#0A1B34',
  gradient2: '#0C372A',
  gradient3: '#369C7E',
  black: '#000000',
  white: '#FFFFFF',
};

const DarkColours: ColourTheme = {
  ...DarkTheme,
  colors: {
    primary: sharedColours.gold,
    background: '#081715',
    card: '',
    text: '#F2F2F2',
    border: '',
    notification: '',
    ...sharedColours,
  },
};

const LightColours: ColourTheme = {
  ...DefaultTheme,
  colors: {
    primary: sharedColours.gold,
    background: '000000',
    card: '',
    text: sharedColours.black,
    border: '',
    notification: '',
    ...sharedColours,
  },
};

export {DarkColours, LightColours};
