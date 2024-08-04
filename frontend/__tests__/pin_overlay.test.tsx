import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PinOverlay from '../src/components/PinOverlay';
import { mockCard } from '../__mocks__/card_mock';
import pinCard from '../src/helper/pinning';

jest.mock('react-native-keychain', () => ({
  default: {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
  },
}));

const mockNavigate = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
  }),
}));

jest.mock('../src/helper/pinning', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('PinOverlay Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the correct text based on card pinned value', () => {
    render(<PinOverlay card={mockCard} modalVisible={true} setModalVisible={jest.fn()} />);
    expect(screen.getByText('Pin to Wallet?')).toBeTruthy();

    render(
      <PinOverlay
        card={{ ...mockCard, pinned: Date.now() }}
        modalVisible={true}
        setModalVisible={jest.fn()}
      />
    );
    expect(screen.getByText('Unpin from Wallet?')).toBeTruthy();
  });

  it('should call pinCard and then navigate Home when Confirm is pressed', () => {
    const mockSetModalVisible = jest.fn();
    render(
      <PinOverlay card={mockCard} modalVisible={true} setModalVisible={mockSetModalVisible} />
    );

    fireEvent.press(screen.getByText('Confirm'));

    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
    expect(pinCard).toHaveBeenCalledWith(mockCard);
    expect(mockReplace).toHaveBeenCalledWith('Home');
  });

  it('should close the overlay when Cancel is pressed', () => {
    const mockSetModalVisible = jest.fn();
    render(
      <PinOverlay card={mockCard} modalVisible={true} setModalVisible={mockSetModalVisible} />
    );

    fireEvent.press(screen.getByText('Cancel'));
    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });
});
