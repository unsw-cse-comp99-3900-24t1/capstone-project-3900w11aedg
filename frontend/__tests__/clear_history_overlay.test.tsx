import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClearHistoryOverlay from '../src/components/ClearHistoryOverlay.tsx';

describe('ClearHistoryOverlay', () => {
  const mockSetModalVisible = jest.fn();
  const mockHandleDelete = jest.fn();

  const defaultProps = {
    modalVisible: true,
    setModalVisible: mockSetModalVisible,
    handleDelete: mockHandleDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when modalVisible is true', () => {
    const { getByText } = render(<ClearHistoryOverlay {...defaultProps} />);

    expect(getByText('Do you wish to permanently delete your presentation history?')).toBeTruthy();
    expect(getByText('All successful presentations will be removed.')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Clear History')).toBeTruthy();
  });

  it('does not render when modalVisible is false', () => {
    const { queryByText } = render(<ClearHistoryOverlay {...defaultProps} modalVisible={false} />);

    expect(queryByText('Do you wish to permanently delete your presentation history?')).toBeNull();
    expect(queryByText('All successful presentations will be removed.')).toBeNull();
  });

  it('calls setModalVisible with false when Cancel is pressed', () => {
    const { getByText } = render(<ClearHistoryOverlay {...defaultProps} />);

    fireEvent.press(getByText('Cancel'));

    expect(mockSetModalVisible).toHaveBeenCalledWith(false);
  });

  it('calls handleDelete when Clear History is pressed', () => {
    const { getByText } = render(<ClearHistoryOverlay {...defaultProps} />);

    fireEvent.press(getByText('Clear History'));

    expect(mockHandleDelete).toHaveBeenCalled();
  });
});
