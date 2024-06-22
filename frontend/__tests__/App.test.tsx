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
  useColorScheme: () => 'light',
}));

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('react-native-biometrics', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isSensorAvailable: jest.fn(),
    simplePrompt: jest.fn(),
  })),
  BiometryTypes: {
    Biometrics: 'Biometrics',
  },
}));

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: jest.fn().mockReturnValue({
      Navigator: ({children}: {children: ReactNode}) => <>{children}</>,
      Screen: ({children}: {children: ReactNode}) => <>{children}</>,
    }),
  };
});

it('renders correctly', () => {
  renderer.create(<App />);
});
