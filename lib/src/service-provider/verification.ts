import * as vc from '@digitalbazaar/vc';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createVerifyCryptosuite } from '@digitalbazaar/bbs-2023-cryptosuite';
import documentLoader from '../document-loader.js';
import { 
	VerifiablePresentation,
	VerifiableCredential, 
	VerifyCredentialResult,
	VerifyPresentationResult 
} from '@digitalbazaar/vc';

export const verifyDocument = async (
	verifiableDocument: VerifiablePresentation | VerifiableCredential,
	isPresentation: boolean = false
): Promise<VerifyCredentialResult | VerifyPresentationResult> => {

	const suite = new DataIntegrityProof({
		signer: null,
		date: new Date().toDateString(),
		cryptosuite: createVerifyCryptosuite()
	});

	return await (isPresentation 
		? vc.verify({ presentation: verifiableDocument, suite, documentLoader, unsignedPresentation: true})
		: vc.verifyCredential({ credential: verifiableDocument, suite, documentLoader }));
}