import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createSignCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from './document-loader.js';

import QRCode from 'qrcode';
import fs from 'fs';
import qr from 'qr-image';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const signCredential = async (credential: any, keyPair: any, did: string) => {
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    date: new Date().toDateString(),
    cryptosuite: createSignCryptosuite({
      mandatoryPointers: ['/issuanceDate', '/issuer'],
    }),
  });

  suite.verificationMethod = did;

  return await vc.issue({
    credential: JSON.parse(credential),
    suite,
    documentLoader,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const credentialToQRCode = async (credential: any) => {
  return QRCode.toDataURL(credential);
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
