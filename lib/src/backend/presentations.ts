import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
    createDiscloseCryptosuite, createSignCryptosuite
  } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';
//import { randomUUID } from 'crypto';

export const deriveCredential = async (verifiableCredential: object): Promise<object> => {
  const suite = new DataIntegrityProof({
    signer: null,
    date: null,
    cryptosuite: createDiscloseCryptosuite({
      proofId: null,
      selectivePointers: ['/credentialSubject'],
    }),
  });
  return await vc.derive({
    verifiableCredential,
    suite,
    documentLoader,
  });
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPresentation = async(credentials: object, keyPair: any): Promise<any> => {
  const presentation = vc.createPresentation({
    verifiableCredential: credentials
  });
  
  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    date: new Date().toDateString(),
    cryptosuite: createSignCryptosuite(),
  });

  return await vc.signPresentation({
    presentation, suite, challenge: "n-0S6_WzA2Mj", documentLoader
  });
}