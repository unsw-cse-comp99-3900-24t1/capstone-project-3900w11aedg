import axios from 'axios';
import { DIDDocument } from 'did-resolver';

async function uploadDIDDocument(
  didDocument: DIDDocument,
  did: string,
) {
  const address = did.split(':')[4];

  try {
    await axios.post(`http://localhost:5000/.well-known/${address}/did.json`, didDocument);
  } catch (error) {
    throw new Error('Error saving the did document' + error);
  }
}

export default uploadDIDDocument;
