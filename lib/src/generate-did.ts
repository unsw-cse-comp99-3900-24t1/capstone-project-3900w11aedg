import axios from 'axios';

async function generateDIDDocument(
  didDocument: any,
  did: string
): Promise<any> {
  const address = did.split(':')[4];

  try {
    await axios.post(`http://localhost:5000/.well-known/${address}/did.json`, didDocument);
  } catch (error) {
    throw new Error('Error saving the did document' + error);
  }

  return didDocument;
}

export default generateDIDDocument;
