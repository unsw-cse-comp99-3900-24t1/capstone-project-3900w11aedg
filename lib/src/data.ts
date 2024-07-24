import fs from 'node:fs';
import { from } from '@digitalbazaar/bls12-381-multikey';
import { isValidDID } from './validation-helper.js';
import type { KeyPair } from '../types/data.js';

export const saveData = (
  didURL: string,
  keyPairURL: string,
  keyPair: KeyPair,
  did: string,
) => {
  fs.writeFileSync(didURL, did);
  fs.writeFileSync(keyPairURL, JSON.stringify(keyPair, null, 2));
};


export const loadData = async (didURL: string, keyPairURL: string): Promise<({ keyPair: KeyPair, did: string })> => {
  if (!fs.existsSync(didURL) || !fs.existsSync(keyPairURL)) {
    throw new Error('Path for did or keyPair does not exist.');
  }

  const keyPair = JSON.parse(fs.readFileSync(keyPairURL, 'utf8'));
  keyPair.publicKey = new Uint8Array(Object.values(keyPair.publicKey));
  keyPair.secretKey = new Uint8Array(Object.values(keyPair.secretKey));
  const did = fs.readFileSync(didURL, 'utf8');
  if (!(await isValidDID(did))) {
    throw new Error('Invalid or outdated DID');
  }
  return {
    did,
    keyPair: await from(keyPair),
  };
};
