import fs from 'fs';
import qr from 'qr-image';
import QRCode from 'qrcode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlToQRCode = async (url: any) => {
  return QRCode.toDataURL(url);
};

export const saveQRCode = async (qrDataUrl: string, outputFilePath: string) => {
  // Extract base64 data from the data URL
  const base64Data = qrDataUrl.split(',')[1];
  if (!base64Data) {
    throw new Error('Invalid data URL');
  }

  // Create a QR code image
  const qrCode = qr.image('data:image/png;base64,' + base64Data, {
    type: 'png',
  });

  // Save the QR code image
  qrCode.pipe(fs.createWriteStream(outputFilePath));
};
