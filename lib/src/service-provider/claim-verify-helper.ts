import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
    createVerifyCryptosuite,
  } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';

export async function verifyClaim(token: object) {
	// TODO - check token is valid

	const suite = new DataIntegrityProof({
		signer: null,
		date: new Date().toDateString(),
		cryptosuite: createVerifyCryptosuite(),
	});

	return await vc.verifyCredential({ credential: token, suite, documentLoader });
}