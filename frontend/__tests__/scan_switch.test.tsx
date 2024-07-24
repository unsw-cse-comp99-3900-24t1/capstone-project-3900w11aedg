import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ScanSwitch from '../src/components/ScanSwitch';

describe('ScanSwitch', () => {
  it('renders correctly and defaults to Scan', () => {
    const setMethod = jest.fn();
    const { getByText } = render(<ScanSwitch method="Scan" setMethod={setMethod} />);

    expect(getByText('Scan QR Code')).toBeTruthy();
    expect(getByText('Upload QR Code')).toBeTruthy();
  });

  it('calls setMethod with "Scan" when Scan QR Code is pressed', () => {
    const setMethod = jest.fn();
    const { getByText } = render(<ScanSwitch method="Upload" setMethod={setMethod} />);

    fireEvent.press(getByText('Scan QR Code'));

    expect(setMethod).toHaveBeenCalledWith('Scan');
  });

  it('calls setMethod with "Upload" when Upload QR Code is pressed', () => {
    const setMethod = jest.fn();
    const { getByText } = render(<ScanSwitch method="Scan" setMethod={setMethod} />);

    fireEvent.press(getByText('Upload QR Code'));

    expect(setMethod).toHaveBeenCalledWith('Upload');
  });
});
