import * as vc from '@digitalbazaar/vc';
import { VerifiableCredential, VerifiablePresentation } from '../../types/credentials.js';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createDiscloseCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';
import { v4 as uuidv4 } from 'uuid';

type ClaimsToKeep = {
  [key: string]: string[];
};

export const deriveAndCreatePresentation = async (
  credentials: (VerifiableCredential & { identifier?: string })[],
  claimsToKeep: ClaimsToKeep
): Promise<VerifiablePresentation> => {
  const promises = credentials.map(
    async (credential: VerifiableCredential & { identifier?: string }) =>
      await deriveCredential(credential, claimsToKeep)
  );

  const derivedCredentials = await Promise.all(promises);
  return vc.createPresentation({
    verifiableCredential: derivedCredentials,
    id: uuidv4(),
  }) as VerifiablePresentation;
};

export const deriveCredential = async (
  verifiableCredential: VerifiableCredential & { identifier?: string },
  claimsToKeep: ClaimsToKeep
): Promise<VerifiableCredential> => {
  if (!verifiableCredential.identifier) {
    throw new Error('Credential identifier not found');
  }
  let selectivePointers: string[] = ['/credentialSubject'];
  const keeping = claimsToKeep[verifiableCredential.identifier] || [];
  if (keeping.length > 0) {
    selectivePointers = keeping
      .filter((claim) => {
        if (!Object.keys(verifiableCredential.credentialSubject).includes(claim)) {
          throw new Error(
            `Claim ${claim} not found in credential ${verifiableCredential.identifier}`
          );
        }
        return true;
      })
      .map((claim) => {
        return `/credentialSubject/${claim}`;
      });
  }

  const vcWithoutIdentifier = { ...verifiableCredential };
  delete vcWithoutIdentifier.identifier;

  const suite = new DataIntegrityProof({
    signer: null,
    date: null,
    cryptosuite: createDiscloseCryptosuite({
      proofId: null,
      selectivePointers,
    }),
  });
  return (await vc.derive({
    verifiableCredential: vcWithoutIdentifier,
    suite,
    documentLoader,
  })) as VerifiableCredential;
};
