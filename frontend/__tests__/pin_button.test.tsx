import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PinButton from '../src/components/PinButton';
import { mockCard } from '../__mocks__/card_mock';

jest.mock('react-native-keychain', () => ({
  default: {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('PinButton', () => {
  it('should render the pin icon', () => {
    render(<PinButton card={mockCard} isExpired={false} />);
    expect(screen.getByTestId('pin-button-icon')).toBeTruthy();
  });

  it('should render the pin overlay when pressed', () => {
    render(<PinButton card={mockCard} isExpired={false} />);

    fireEvent.press(screen.getByTestId('pin-button-icon'));
    expect(screen.getByTestId('pin-overlay')).toBeTruthy();
  });
});
