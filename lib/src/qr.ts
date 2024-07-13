import fs from 'fs';
import QRCode from 'qrcode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlToQRCode = async (url: any) => {
  return QRCode.toDataURL(url);
};

export const saveQRCode = async (qrDataUrl: string, outputFilePath: string) => {
  try {
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(outputFilePath, imageBuffer);
  } catch (error) {
    throw new Error('Error saving QR code' + error);
  }
};
