import React from 'react';
import { render } from '@testing-library/react-native';
import Footer from '../src/components/Footer.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useRoute: () => ({
      name: 'Home',
    }),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe('Footer', () => {
  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({
      bottom: 10,
      left: 10,
      right: 10,
      top: 10,
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Credentials')).toBeTruthy();
    expect(getByText('Scan')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
