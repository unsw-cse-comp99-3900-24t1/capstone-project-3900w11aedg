import * as vc from '@digitalbazaar/vc';
import { VerifiableCredential, VerifiablePresentation } from '../../types/credentials.js';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createDiscloseCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';
import { v4 as uuidv4 } from 'uuid';

export const deriveAndCreatePresentation = async (credentials: VerifiableCredential[], claimsToKeep?: string[]): Promise<VerifiablePresentation> => {
  if (claimsToKeep && claimsToKeep.some((claim) => credentials.every((vc: VerifiableCredential) => !Object.keys(vc.credentialSubject).includes(claim)))) {
    throw new Error(`Some claims to keep are not present in any credential`);
  }

  const promises = credentials.map(async (credential: VerifiableCredential) => await deriveCredential(credential as VerifiableCredential, claimsToKeep));

  const derivedCredentials = (await Promise.all(promises)).filter((vc: object | null) => vc !== null);

  return vc.createPresentation({
    verifiableCredential: derivedCredentials,
    id: uuidv4(),
  }) as VerifiablePresentation;
};

export const deriveCredential = async (verifiableCredential: VerifiableCredential, claimsToKeep?: string[]): Promise<VerifiableCredential | null> => {
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
  }) as VerifiableCredential;
};
