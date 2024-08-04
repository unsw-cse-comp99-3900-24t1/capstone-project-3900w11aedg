import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddedCredPopup from '../src/components/AddedCredPopup.tsx';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('AddedCredPopup', () => {
  it('renders correctly when modalVisible is true', () => {
    const { getByText } = render(<AddedCredPopup modalVisible={true} setModalVisible={() => {}} />);

    expect(getByText('Added to Wallet')).toBeTruthy();
  });

  it('does not render when modalVisible is false', () => {
    const { queryByText } = render(
      <AddedCredPopup modalVisible={false} setModalVisible={() => {}} />
    );

    expect(queryByText('Added to Wallet')).toBeNull();
  });

  it('calls handleClose on modal press', () => {
    const setModalVisible = jest.fn();
    const { getByText } = render(
      <AddedCredPopup modalVisible={true} setModalVisible={setModalVisible} />
    );

    fireEvent.press(getByText('Added to Wallet'));

    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
