import axios from 'axios';
import { DIDDocument, VerificationMethod } from 'did-resolver';

async function generateDIDDocument(
  publicKey: VerificationMethod,
  did: string
): Promise<DIDDocument> {
  const didDocument: DIDDocument = {
    '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/multikey/v1'],
    id: did,
    publicKey: [publicKey],
    assertionMethod: [publicKey],
  };

  const address = did.split(':')[3];

  try {
    await axios.post(`http://localhost:5000/.well-known/${address}/did.json`, didDocument);
  } catch (error) {
    throw new Error('Error saving the did document' + error);
  }

  return didDocument;
}

export default generateDIDDocument;
