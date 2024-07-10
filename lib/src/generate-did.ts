import axios from 'axios';

async function uploadDIDDocument(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  didDocument: any,
  did: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const address = did.split(':')[4];

  try {
    await axios.post(`http://localhost:5000/.well-known/${address}/did.json`, didDocument);
  } catch (error) {
    throw new Error('Error saving the did document' + error);
  }

  return didDocument;
}

export default uploadDIDDocument;
