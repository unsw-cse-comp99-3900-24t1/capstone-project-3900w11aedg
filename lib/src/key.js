import * as bls12381Multikey from '@digitalbazaar/bls12-381-multikey';

const generateKeyPair = async ({ controller = 'http://localhost:5000', id = 'someId' } = {}) => {
  if (!id) {
    throw new Error('id is required');
  }
  return await bls12381Multikey.generateBbsKeyPair({
    seed: new Uint8Array(32),
    algorithm: 'BBS-BLS12-381-SHA-256',
    controller,
    id,
  });
};

export default generateKeyPair;
