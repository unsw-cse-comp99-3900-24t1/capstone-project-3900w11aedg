import 'react-native';
import React from 'react';
import LoginScreen from '../src/screens/LoginScreen';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {SafeAreaProvider} from 'react-native-safe-area-context';

it('renders correctly', () => {
  renderer.create(
    <SafeAreaProvider>
      <LoginScreen />
    </SafeAreaProvider>
  );
});
