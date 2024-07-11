import * as bls12381Multikey from '@digitalbazaar/bls12-381-multikey';
import { v4 as uuidv4 } from 'uuid';
import { driver } from './did-driver/index.js';
import { httpsUrlToDidUrl } from './did-driver/helpers.js';

const generateKeyPair = async ({ url = 'http://localhost:5000' } = {}) => {
  const didWebDriver = driver();

  didWebDriver.use({
    multibaseMultikeyHeader: 'zUC7',
    fromMultibase: bls12381Multikey.from,
  });

  const id = uuidv4();
  const httpsUrl = url + '/.well-known/' + id + '/did.json';
  const did = httpsUrlToDidUrl(httpsUrl).did;

  const verificationKeyPair = await bls12381Multikey.generateBbsKeyPair({
    seed: new Uint8Array(32),
    algorithm: bls12381Multikey.ALGORITHMS.BBS_BLS12381_SHA256,
    controller: did,
  });

  const { didDocument } = await didWebDriver.fromKeyPair({
    url: httpsUrl,
    verificationKeyPair,
  });

  return {
    did,
    keyPair: verificationKeyPair,
    didDocument,
  };
};

export default generateKeyPair;
