import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RadioButtonList from '../src/components/RadioButtonList';

describe('RadioButtonList', () => {
  it('should render the radio buttons unselected initially', () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <RadioButtonList selectedValue={null} setSelectedValue={jest.fn()} setReverse={jest.fn()} />
    );

    expect(getAllByTestId('radio-button-unselected')).toHaveLength(8);
    expect(queryAllByTestId('radio-button-selected')).toHaveLength(0);
  });

  it('should only select one radio button at a time and call setSelectedValue and setReverse', () => {
    const mockSetSelectedValue = jest.fn();
    const mockSetReverse = jest.fn();
    const { queryAllByTestId, getByText } = render(
      <RadioButtonList
        selectedValue="Name"
        setSelectedValue={mockSetSelectedValue}
        setReverse={mockSetReverse}
      />
    );
    expect(queryAllByTestId('radio-button-selected')).toHaveLength(1);

    fireEvent.press(getByText('Name (Z -> A)'));

    expect(mockSetSelectedValue).toHaveBeenCalledWith('NameR');
    expect(mockSetReverse).toHaveBeenCalledWith(false);
    expect(queryAllByTestId('radio-button-selected')).toHaveLength(1);
  });
});
