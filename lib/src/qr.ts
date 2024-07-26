import fs from 'fs';

export const saveQRCode = async (qrDataUrl: string, outputFilePath: string) => {
  try {
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(outputFilePath, imageBuffer);
  } catch (error) {
    throw new Error('Error saving QR code' + error);
  }
};
