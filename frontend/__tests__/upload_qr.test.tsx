import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UploadQR from '../src/components/UploadQR';
import { launchImageLibrary } from 'react-native-image-picker';
import jsQR from 'jsqr';
import jpeg from 'jpeg-js';
import { Buffer } from 'buffer';
import { Alert } from 'react-native';

// Mock the dependencies
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

jest.mock('jsqr', () => jest.fn());
jest.mock('jpeg-js', () => ({
  decode: jest.fn(),
}));

jest.mock('buffer', () => ({
  Buffer: {
    from: jest.fn(),
  },
}));

jest.spyOn(Alert, 'alert');

describe('UploadQR Component', () => {
  const mockOnRead = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<UploadQR onRead={mockOnRead} />);
    expect(getByText('Browse')).toBeTruthy();
  });

  it('opens image library when Browse button is pressed', async () => {
    const { getByText } = render(<UploadQR onRead={mockOnRead} />);
    const browseButton = getByText('Browse');

    fireEvent.press(browseButton);
    expect(launchImageLibrary).toHaveBeenCalled();
  });

  // it('handles image selection and sets the chosen image for the user to see', async () => {
  //   (launchImageLibrary as jest.Mock).mockImplementationOnce(() => ({
  //     // add all image asset information
  //     assets: [
  //       {
  //         base64: 'fakeBase64',
  //         height: 400,
  //         type: 'image/jpeg',
  //         width: 300,
  //       },
  //     ],
  //   }));

  //   const { getByText, getByLabelText } = render(<UploadQR onRead={mockOnRead} />);
  //   const browseButton = getByText('Browse');

  //   fireEvent.press(browseButton);
  //   await waitFor(() => getByLabelText('selected image'));
  //   expect(getByLabelText('selected image')).toBeTruthy();
  // });

  it('uploads and processes the QR code from a JPEG image', async () => {
    const fakeQRCodeData = 'fakeQRCodeData';
    const fakeImage = {
      base64: 'fakeBase64',
      height: 400,
      type: 'image/jpeg',
      width: 300,
    };

    (launchImageLibrary as jest.Mock).mockImplementationOnce(() => ({
      assets: [fakeImage],
    }));

    (jpeg.decode as jest.Mock).mockImplementationOnce(() => ({
      data: new Uint8Array(400 * 300 * 4),
    }));

    (Buffer.from as jest.Mock).mockImplementationOnce(() => new Uint8Array());
    (jsQR as jest.Mock).mockImplementationOnce(() => ({
      data: fakeQRCodeData,
    }));

    const { getByText } = render(<UploadQR onRead={mockOnRead} />);
    const browseButton = getByText('Browse');

    fireEvent.press(browseButton);
    const uploadButton = await waitFor(() => getByText('Upload'));
    fireEvent.press(uploadButton);

    await waitFor(() => expect(mockOnRead).toHaveBeenCalledWith(fakeQRCodeData));
  });

  // it('shows an alert if the image does not contain a QR code', async () => {
  //   const fakeImage = {
  //     base64: 'fakeBase64',
  //     height: 400,
  //     type: 'image/jpeg',
  //     width: 300,
  //   };

  //   (launchImageLibrary as jest.Mock).mockImplementationOnce(() => ({
  //     assets: [fakeImage],
  //   }));

  //   (jpeg.decode as jest.Mock).mockImplementationOnce(() => ({
  //     data: new Uint8Array(400 * 300 * 4),
  //   }));

  //   (Buffer.from as jest.Mock).mockImplementationOnce(() => new Uint8Array());
  //   (jsQR as jest.Mock).mockImplementationOnce(() => null);

  //   const { getByText, getByRole } = render(<UploadQR onRead={mockOnRead} />);
  //   const browseButton = getByText('Browse');

  //   fireEvent.press(browseButton);
  //   const uploadButton = await waitFor(() => getByText('Upload'));
  //   fireEvent.press(uploadButton);

  //   await waitFor(() =>
  //     expect(getByRole('alert')).toThrow('Image does not have a visible QR code.')
  //   );
  // });
});
