import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createSignCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';
import { UnsignedCredential, VerifiableCredential } from '../../types/credentials.js';
import { KeyPair } from '../../types/data.js';

export const signCredential = async (credential: UnsignedCredential, keyPair: KeyPair): Promise<VerifiableCredential> => {
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    date: new Date().toDateString(),
    cryptosuite: createSignCryptosuite({
      mandatoryPointers: ['/issuanceDate', '/issuer'],
    }),
  });

  return await vc.issue({
    credential,
    suite,
    documentLoader,
  }) as VerifiableCredential;
};
