import { beforeEach, describe, jest } from '@jest/globals';
import { VerifiableCredential, VerifiablePresentation } from '../types/credentials';
import { v4 as uuidv4 } from 'uuid';

jest.unstable_mockModule('@digitalbazaar/vc', () => ({
  createPresentation: jest.fn(),
  derive: jest.fn(),
}));

const { deriveCredential, deriveAndCreatePresentation } = await import('../src/backend/presentations');

const mockCredential: VerifiableCredential = {
  '@context': [
    'https://www.context.org/sample',
  ],
  'type': [
    'VerifiableCredential',
  ],
  'issuer': 'did:web:example.com',
  'issuanceDate': '2024-07-23T10:01:42Z',
  'credentialSubject': {
    'alumniOf': 'University of New South Wales',
    'degree': 'Bachelor of Computer Science (Honours)',
  },
  'proof': {
    'type': 'DataIntegrityProof',
    'verificationMethod': 'did:web:example.com#key',
    'cryptosuite': 'bbs-2023',
    'proofPurpose': 'assertionMethod',
    'proofValue': 'eyJhbGciOi',
  },
};

const mockCredentialSecond: VerifiableCredential = {
  '@context': [
    'https://www.context.org/sample',
  ],
  'type': [
    'VerifiableCredential',
  ],
  'issuer': 'did:web:example.com',
  'issuanceDate': '2024-07-23T10:01:42Z',
  'credentialSubject': {
    'worksAt': 'McDonalds',
  },
  'proof': {
    'type': 'DataIntegrityProof',
    'verificationMethod': 'did:web:example.com#key',
    'cryptosuite': 'bbs-2023',
    'proofPurpose': 'assertionMethod',
    'proofValue': 'eyJhbGciOi',
  },
};

const mockPresentation: VerifiablePresentation = {
  '@context': [
    'https://www.context.org/sample',
  ],
  'type': [
    'VerifiablePresentation',
  ],
  'verifiableCredential': [mockCredential],
  'id': uuidv4(),
};

describe('Derivation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return null if claimsToKeep does not contain any claims in the credential', async () => {
    const res = await deriveCredential(mockCredential, ['cat']);
    expect(res).toBeNull();
  });

  it('Should return a derived credential with only the claims specified in claimsToKeep', async () => {
    const { derive } = await import('@digitalbazaar/vc');
    (derive as jest.MockedFunction<typeof derive>).mockResolvedValueOnce({
      ...mockCredential,
      credentialSubject: { degree: 'Bachelor of Computer Science (Honours)' },
    });
    const res = await deriveCredential(mockCredential, ['degree']) as VerifiableCredential;
    expect(res.credentialSubject).toStrictEqual({ degree: 'Bachelor of Computer Science (Honours)' });
  });

  it('Deriving a presentation throws an error if claimsToKeep does not contain any claims in any credential', async () => {
    await expect(deriveAndCreatePresentation([mockCredential], ['cat'])).rejects.toThrow('Some claims to keep are not present in any credential');
  });

  it('Deriving a presentation returns a presentation with only the claims specified in claimsToKeep', async () => {
    const { createPresentation } = await import('@digitalbazaar/vc');
    (createPresentation as jest.MockedFunction<typeof createPresentation>).mockResolvedValueOnce({
      ...mockPresentation,
      verifiableCredential: [{
        ...mockCredential,
        credentialSubject: { degree: 'Bachelor of Computer Science (Honours)' },
      }],
    } as never);
    const res = await deriveAndCreatePresentation([mockCredential], ['degree']);
    expect(res.verifiableCredential[0].credentialSubject).toStrictEqual({ degree: 'Bachelor of Computer Science (Honours)' });
  });

  it('Deriving a presentation with multiple credentials', async () => {
    const { createPresentation } = await import('@digitalbazaar/vc');
    (createPresentation as jest.MockedFunction<typeof createPresentation>).mockResolvedValueOnce({
      ...mockPresentation,
      verifiableCredential: [mockCredential, mockCredentialSecond],
    } as never);
    const res = await deriveAndCreatePresentation([mockCredential, mockCredentialSecond]);
    expect(res.verifiableCredential).toContainEqual(mockCredential);
    expect(res.verifiableCredential).toContainEqual(mockCredentialSecond);
  });

  it('Deriving a presentation with multiple credentials where claimsToKeep does not involve one of the credentials', async () => {
    const { createPresentation } = await import('@digitalbazaar/vc');
    (createPresentation as jest.MockedFunction<typeof createPresentation>).mockResolvedValueOnce({
      ...mockPresentation,
      verifiableCredential: [mockCredential],
    } as never);
    const derived = await deriveCredential(mockCredentialSecond, ['degree']);
    expect(derived).toBeNull();
    const res = await deriveAndCreatePresentation([mockCredential, mockCredentialSecond], ['degree']);
    expect(res.verifiableCredential).toContainEqual(mockCredential);
    expect(res.verifiableCredential).not.toContain(mockCredentialSecond);
  });

});