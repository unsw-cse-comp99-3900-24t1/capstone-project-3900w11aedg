import React from 'react';
import { render } from '@testing-library/react-native';
import RadioButton from '../src/components/RadioButton';

describe('RadioButton', () => {
  it('should render the unselected radio button', () => {
    const { getByText, getByTestId } = render(
      <RadioButton label={'Example Option'} value={''} selected={false} onSelect={jest.fn()} />
    );
    expect(getByText('Example Option')).toBeTruthy();
    expect(getByTestId('radio-button-unselected')).toBeTruthy();
  });

  it('should change to the selected button when selected is true', () => {
    const { rerender, getByTestId } = render(
      <RadioButton label={'Example Option'} value={''} selected={false} onSelect={jest.fn()} />
    );

    rerender(
      <RadioButton label={'Example Option'} value={''} selected={true} onSelect={jest.fn()} />
    );
    expect(getByTestId('radio-button-selected')).toBeTruthy();
  });
});
