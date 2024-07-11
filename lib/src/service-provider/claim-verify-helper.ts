import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import {
    createDiscloseCryptosuite,
    createVerifyCryptosuite,
  } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';

export async function verifyClaim(token: object) {
	// TODO - check token is valid
	
	const suiteDerive = new DataIntegrityProof({
		signer: null,
		date: null,
		cryptosuite: createDiscloseCryptosuite({
				proofId: null,
				selectivePointers: ['/credentialSubject'],
		}),
	});
	///////////////////////////////////////
	// TODO - Move to Identity Owner Backend
	const derivedVC = await vc.derive({
		verifiableCredential: token,
		suite: suiteDerive,
		documentLoader,
	});
	token = derivedVC;
	///////////////////////////////////////

	const suite = new DataIntegrityProof({
		signer: null,
		date: new Date().toDateString(),
		cryptosuite: createVerifyCryptosuite(),
	});

	return await vc.verifyCredential({ credential: token, suite, documentLoader });
}