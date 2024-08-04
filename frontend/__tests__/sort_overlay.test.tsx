import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SortOverlay from '../src/components/SortOverlay';
import * as fetchDataModule from '../src/helper/data';
import { mockCard } from '../__mocks__/card_mock';

jest.mock('../src/helper/data');

jest.mock('react-native-keychain', () => ({
  default: {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
  },
}));

describe('SortOverlay', () => {
  beforeEach(() => {
    const mockFetchData = fetchDataModule.fetchData as jest.Mock;
    mockFetchData.mockResolvedValue([mockCard]);
  });

  const renderOverlay = () => {
    const mockSetModalVisible = jest.fn();
    const mockSetSortText = jest.fn();
    const mockSetCards = jest.fn();
    const { getByText, rerender } = render(
      <SortOverlay
        setCards={mockSetCards}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        setSortText={mockSetSortText}
      />
    );
    return { getByText, rerender, mockSetModalVisible, mockSetSortText, mockSetCards };
  };

  it('should render the overlay', async () => {
    const { getByText } = renderOverlay();

    expect(getByText('Sort by')).toBeTruthy();
    expect(getByText('Name (A -> Z)')).toBeTruthy();
    expect(getByText('Issuer (A -> Z)')).toBeTruthy();
    expect(getByText('Issuance Date (oldest -> newest)')).toBeTruthy();
    expect(getByText('Expiry Date (closest -> latest)')).toBeTruthy();
    expect(getByText('Name (Z -> A)')).toBeTruthy();
    expect(getByText('Issuance Date (newest -> oldest)')).toBeTruthy();
    expect(getByText('Expiry Date (latest -> closest)')).toBeTruthy();
  });

  it('should sort once option is selected and confirmed', async () => {
    const { getByText, mockSetModalVisible, mockSetSortText, mockSetCards } = renderOverlay();

    fireEvent.press(getByText('Name (A -> Z)'));
    fireEvent.press(getByText('Confirm'));
    await waitFor(() => {
      expect(mockSetSortText).toHaveBeenCalledWith('Name');
      expect(mockSetCards).toHaveBeenCalled();
      expect(mockSetModalVisible).toHaveBeenCalledWith(false);
    });
  });

  it('should reset previous sort', async () => {
    const { getByText, mockSetModalVisible, mockSetSortText, mockSetCards, rerender } =
      renderOverlay();
    fireEvent.press(getByText('Name (A -> Z)'));
    fireEvent.press(getByText('Confirm'));

    rerender(
      <SortOverlay
        setCards={mockSetCards}
        modalVisible={true}
        setModalVisible={mockSetModalVisible}
        setSortText={mockSetSortText}
      />
    );

    fireEvent.press(getByText('Reset'));
    fireEvent.press(getByText('Confirm'));
    await waitFor(() => {
      expect(mockSetSortText).toHaveBeenCalledWith('Sort');
      expect(mockSetCards).toHaveBeenCalled();
      expect(mockSetModalVisible).toHaveBeenCalledWith(false);
    });
  });
});
