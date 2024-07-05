import * as bls12381Multikey from '@digitalbazaar/bls12-381-multikey';

const generateKeyPair = async ({ controller = 'http://localhost:5000', id } = {}) => {
  if (!id) {
    throw new Error('ID is required');
  }
  return await bls12381Multikey.generateBbsKeyPair({
    algorithm: 'BBS-BLS12-381-SHA-256',
    controller,
    id,
  });
};

export default generateKeyPair;
