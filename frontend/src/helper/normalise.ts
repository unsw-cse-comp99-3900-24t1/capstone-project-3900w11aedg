import { Card, VerifiableCredential } from '../config/types.ts';
const normaliseCredential = (name: string, credential: string): Card => {
  const JSONCredential = JSON.parse(credential) as VerifiableCredential & { identifier: string };
  const types = JSONCredential.type;
  const originalName = name;
  if (types.length === 0 || types[0] !== 'VerifiableCredential') {
    throw new Error('Credential type is invalid');
  }
  let type = (types.length > 1 ? types[1] : types[0]) as string;
  // Change type in PascalCase to Pascal Case
  type = type.replace(/([A-Z])/g, ' $1').trim();
  // Remove all text following an _ character
  if (name.includes('_')) {
    name = name.split('_')[0] as string;
  }
  name = name.replace(/([A-Z])/g, ' $1').trim();
  return {
    id: JSONCredential.identifier,
    name,
    type,
    description: JSONCredential.description || '',
    credIssuedBy: JSONCredential.issuer,
    claims: JSONCredential.credentialSubject,
    issuanceDate: JSONCredential.issuanceDate,
    expiryDate: JSONCredential.expirationDate || '',
    originalName,
    pinned: JSONCredential.pinned,
  } as Card;
};

export const normaliseKey = (key: string): string => {
  key = key.replace(/([A-Z])/g, ' $1');
  //if (key.includes(' ')) key = key.split(' ')[0] as string;
  return key.charAt(0).toUpperCase() + key.slice(1);
};

export const normaliseURL = (url: string): string => {
  return url.replace(/(^\w+:|^)\/\//, '');
};

export default normaliseCredential;
