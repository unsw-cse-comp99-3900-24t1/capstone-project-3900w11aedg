/**
 * @format
 */

import 'react-native';
import React, {ReactNode} from 'react';
import App from '../src/App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Mocking the necessary modules
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: ReactNode}) => <>{children}</>,
  DefaultTheme: {},
  DarkTheme: {},
  useColorScheme: () => 'light', // or 'dark' if you want to test the dark theme
}));

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: jest.fn().mockReturnValue({
      Navigator: ({children}: {children: ReactNode}) => <>{children}</>,
      Screen: ({children}: {children: ReactNode}) => <>{children}</>,
    }),
  };
});

jest.mock('../src/screens/LoginScreen', () => {
  return {
    __esModule: true,
    default: () => {
      return <div>LoginScreen</div>;
    },
  };
});

it('renders correctly', () => {
  renderer.create(<App />);
});
