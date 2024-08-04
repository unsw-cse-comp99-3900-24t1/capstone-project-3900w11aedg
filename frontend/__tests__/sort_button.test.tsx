import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import SortButton from '../src/components/SortButton';
import * as fetchDataModule from '../src/helper/data';
import { mockCard } from '../__mocks__/card_mock';

jest.mock('../src/helper/data');

jest.mock('react-native-keychain', () => ({
  default: {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
  },
}));

describe('SortButton', () => {
  it('should render the Sort text and icon', async () => {
    const { getByText, getByTestId } = render(<SortButton setCards={jest.fn()} />);
    expect(getByText('Sort')).toBeTruthy();
    expect(getByTestId('sort-icon-white')).toBeTruthy();
  });

  it('should display sort overlay when sort button is clicked', () => {
    const { getByText } = render(<SortButton setCards={jest.fn()} />);
    fireEvent.press(getByText('Sort'));
    expect(screen.getByTestId('sort-overlay')).toBeTruthy();
  });

  it('should update text and icon on button when a sort option is confirmed or reset', async () => {
    const mockFetchData = fetchDataModule.fetchData as jest.Mock;
    mockFetchData.mockResolvedValue([mockCard]);

    const mockSetCards = jest.fn();
    render(<SortButton setCards={mockSetCards} />);
    fireEvent.press(screen.getByText('Sort'));
    fireEvent.press(screen.getByText('Name (A -> Z)'));
    fireEvent.press(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(mockSetCards).toHaveBeenCalled();
    });
    expect(screen.queryByTestId('sort-overlay')).toBeFalsy();
    expect(screen.getByText('Name')).toBeTruthy();
    expect(screen.getByTestId('sort-icon-black')).toBeTruthy();

    fireEvent.press(screen.getByText('Name'));
    fireEvent.press(screen.getByText('Reset'));
    fireEvent.press(screen.getByText('Confirm'));

    await waitFor(() => {
      expect(mockSetCards).toHaveBeenCalled();
    });
    expect(screen.getByText('Sort')).toBeTruthy();
    expect(screen.getByTestId('sort-icon-white')).toBeTruthy();
  });
});
