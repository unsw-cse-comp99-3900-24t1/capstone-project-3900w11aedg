import path from 'path';
import fs from 'node:fs';
import { from } from '@digitalbazaar/bls12-381-multikey';
import { isValidDID } from './validation-helper.js';

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
  console.log('hi');
  // if (!fs.existsSync(didURL) || !fs.existsSync(keyPairURL)) {
  //   throw new Error('Path for did or keyPair does not exist.');
  // }

  const keyPair = JSON.parse(fs.readFileSync(keyPairURL, 'utf8'));
  keyPair.publicKey = new Uint8Array(Object.values(keyPair.publicKey));
  keyPair.secretKey = new Uint8Array(Object.values(keyPair.secretKey));
  const did = fs.readFileSync(didURL, 'utf8');
  console.log('HELLO');
  if (!(await isValidDID(did))) {
    throw new Error('Invalid DID');
  }
  return {
    did: did,
    keyPair: await from(keyPair),
  };
};
