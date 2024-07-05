import bbs from '@digitalbazaar/bls12-381-multikey';

const generateKeyPair = async (controller, id) => {
  return await bbs.generateBbsKeyPair({
    algorithm: 'BBS-BLS12-381-SHA-256',
    controller,
    id,
  });
};

export default generateKeyPair;
