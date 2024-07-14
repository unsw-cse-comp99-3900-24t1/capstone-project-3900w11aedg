import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
    createVerifyCryptosuite,
  } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function verifyClaim(token: any, isPresentation = false) {
	// TODO - check token is valid

	const suite = new DataIntegrityProof({
		signer: null,
		date: new Date().toDateString(),
		cryptosuite: createVerifyCryptosuite()
	});

	return await (isPresentation 
		? vc.verify({ presentation: token, challenge: "n-0S6_WzA2Mj", suite, documentLoader})
		: vc.verifyCredential({ credential: token, suite, documentLoader }));
}