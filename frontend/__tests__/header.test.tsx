import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../src/components/Header.tsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({
      top: 10,
    });
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<Header />);
    const image = getByTestId('test');
    expect(image).toBeTruthy();
    expect(image.findByProps({ source: require('../src/assets/smol_logo.png') })).toBeTruthy();
  });
});
