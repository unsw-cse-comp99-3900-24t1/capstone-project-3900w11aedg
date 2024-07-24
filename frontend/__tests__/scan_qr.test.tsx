import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import ScanQR from '../src/components/ScanQR';

jest.mock('react-native-qrcode-scanner', () => {
  return jest.fn().mockImplementation(({ onRead }) => {
    return <MockQRCodeScanner onRead={onRead} />;
  });
});

interface QRCodeReadEvent {
  data: string;
}

interface MockQRCodeScannerProps {
  onRead: (event: QRCodeReadEvent) => void;
}

const MockQRCodeScanner: React.FC<MockQRCodeScannerProps> = ({ onRead }) => (
  <View>
    <View testID="mock-qr-code-scanner" />
    <TouchableOpacity onPress={() => onRead({ data: 'test-route' })}>
      <Text>Simulate QR Scan</Text>
    </TouchableOpacity>
  </View>
);

describe('ScanQR', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ScanQR onRead={jest.fn()} />);
    expect(getByTestId('mock-qr-code-scanner')).toBeTruthy();
  });

  it('calls onRead with the correct data when QR code is scanned', () => {
    const mockOnRead = jest.fn();
    const { getByText } = render(<ScanQR onRead={mockOnRead} />);

    fireEvent.press(getByText('Simulate QR Scan'));

    expect(mockOnRead).toHaveBeenCalledWith('test-route');
  });
});
