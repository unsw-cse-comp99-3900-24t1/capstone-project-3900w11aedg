import crypto from 'crypto';
import axios from 'axios';
import {DIDDocument} from 'did-resolver';

export function generateDID(publicKey: string) {
  const didHash = crypto.createHash('sha256');
  didHash.update(publicKey);
  const didHashHex = didHash.digest('hex');

  const didDocument: DIDDocument = {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: `did:web:${didHashHex}`,
    publicKey: [
      {
        id: `did:web:${didHashHex}#key-1`,
        type: 'Ed25519VerificationKey2018',
        controller: `did:example:${didHashHex}`,
        publicKeyBase58: publicKey,
      },
    ],
  };

  try {
    axios.post(`http://localhost:5000/${didHashHex}/.well-known/did.json`, didDocument);
  } catch (error) {
    throw new Error('Error saving the did document');
  }

  return didDocument;
}