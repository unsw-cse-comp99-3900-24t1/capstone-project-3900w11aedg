import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
    createVerifyCryptosuite,
  } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';
  
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const verify = async(verifiableDocument: any, isPresentation: boolean = false): Promise<any> => {
	const suite = new DataIntegrityProof({
		signer: null,
		date: new Date().toDateString(),
		cryptosuite: createVerifyCryptosuite()
	});

	return await (isPresentation 
		? vc.verify({ presentation: verifiableDocument, suite, documentLoader, unsignedPresentation: true})
		: vc.verifyCredential({ credential: verifiableDocument, suite, documentLoader }));
}