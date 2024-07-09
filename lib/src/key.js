import * as bls12381Multikey from '@digitalbazaar/bls12-381-multikey';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const generateKeyPair = async ({ controller = 'did:web:localhost%3A5000' } = {}) => {
  const id = uuidv4();
  const didHash = crypto.createHash('sha256');
  didHash.update(id);
  const didHashHex = didHash.digest('hex');
  const did = controller + ':' + didHashHex;
  const keyPair = await bls12381Multikey.generateBbsKeyPair({
    seed: new Uint8Array(32),
    algorithm: bls12381Multikey.ALGORITHMS.BBS_BLS12381_SHA256,
    controller: did,
  });
  return {
    did,
    keyPair,
  };
};

export default generateKeyPair;
