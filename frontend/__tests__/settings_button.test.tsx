import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsButton from '../src/components/SettingsButton';

describe('SettingsButton', () => {
  it('should render the button and navigate on press', () => {
    const mockNavigate = jest.fn();
    const handlePress = () => mockNavigate('NextPage');

    const { getByText, getByTestId } = render(
      <SettingsButton
        isFirst={true}
        imageSource={require('../src/assets/bin.png')}
        text={'Example Text'}
        secondImageSource={require('../src/assets/right-arrow.png')}
        handlePress={handlePress}
      />
    );

    expect(getByText('Example Text')).toBeTruthy();
    expect(getByTestId('settings-button-icon-left')).toBeTruthy();
    expect(getByTestId('settings-button-icon-right')).toBeTruthy();

    fireEvent.press(getByText('Example Text'));
    expect(mockNavigate).toHaveBeenCalledWith('NextPage');
  });
});
