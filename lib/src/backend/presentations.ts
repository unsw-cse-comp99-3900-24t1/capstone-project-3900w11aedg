import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createDiscloseCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deriveAndCreatePresentation = async (credentials: any, claimsToKeep?: string[]): Promise<any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (claimsToKeep && claimsToKeep.some((claim) => credentials.every((vc: any) => !Object.keys(vc.credentialSubject).includes(claim)))) {
    throw new Error(`Some claims to keep are not present in any credential`);
  }

  const promises = credentials.map(async (credential: object) => await deriveCredential(credential, claimsToKeep));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const derivedCredentials = (await Promise.all(promises)).filter((vc: any) => vc !== null);

  return vc.createPresentation({
    verifiableCredential: derivedCredentials,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deriveCredential = async (verifiableCredential: any, claimsToKeep?: string[]): Promise<object | null> => {
  let selectivePointers: string[] = ['/credentialSubject'];
  if (claimsToKeep) {
    const relevantClaims = claimsToKeep.filter((claim) => Object.keys(verifiableCredential.credentialSubject).includes(claim));
    if (relevantClaims.length === 0)
      return null;
    selectivePointers = relevantClaims.map((claim) => {
      return `/credentialSubject/${claim}`;
    });
  }

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
