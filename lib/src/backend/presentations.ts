import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createDiscloseCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deriveAndCreatePresentation = async (credentials: any, claimsToKeep: string[]): Promise<object> => {
  const promises = credentials.map(async (credential: object) => await deriveCredential(credential, claimsToKeep));
  const derivedCredentials = await Promise.all(promises);

  return vc.createPresentation({
    verifiableCredential: derivedCredentials,
  });
};

export const deriveCredential = async (verifiableCredential: object, claimsToKeep: string[]): Promise<object> => {
  const selectivePointers = claimsToKeep.map((claim) => `/credentialSubject/${claim}`);
  const suite = new DataIntegrityProof({
    signer: null,
    date: null,
    cryptosuite: createDiscloseCryptosuite({
      proofId: null,
      selectivePointers,
    }),
  });
  return await vc.derive({
    verifiableCredential,
    suite,
    documentLoader,
  });
};
