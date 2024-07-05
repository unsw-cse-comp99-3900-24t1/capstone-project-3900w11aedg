import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { from } from '@digitalbazaar/bls12-381-multikey';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

export const saveData = (
  didURL: string = path.join(__dirname, 'did.txt'),
  keyPairURL: string = path.join(__dirname, 'keyPair.key'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyPair: any,
  did: string
) => {
  fs.writeFileSync(didURL, did);
  fs.writeFileSync(keyPairURL, JSON.stringify(keyPair, null, 2));
};

export const loadData = async (
  didURL: string = path.join(__dirname, 'did.txt'),
  keyPairURL: string = path.join(__dirname, 'keyPair.key')
) => {
  if (!fs.existsSync(didURL) || !fs.existsSync(keyPairURL)) {
    throw new Error('Path for did or keyPair does not exist.');
  }

  const keyPair = JSON.parse(fs.readFileSync(keyPairURL, 'utf8'));
  keyPair.publicKey = new Uint8Array(Object.values(keyPair.publicKey));
  keyPair.secretKey = new Uint8Array(Object.values(keyPair.secretKey));
  return {
    did: fs.readFileSync(didURL, 'utf8'),
    keyPair: await from(keyPair),
  };
};
