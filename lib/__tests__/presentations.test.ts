import { beforeEach, describe, jest } from '@jest/globals';
import { VerifiableCredential, VerifiablePresentation } from '../types/credentials';
import { v4 as uuidv4 } from 'uuid';

jest.unstable_mockModule('@digitalbazaar/vc', () => ({
  createPresentation: jest.fn(),
  derive: jest.fn(),
}));

const { deriveCredential, deriveAndCreatePresentation } = await import(
  '../src/backend/presentations'
);

const mockCredential: VerifiableCredential & { identifier?: string } = {
  '@context': ['https://www.context.org/sample'],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  issuanceDate: '2024-07-23T10:01:42Z',
  credentialSubject: {
    alumniOf: 'University of New South Wales',
    degree: 'Bachelor of Computer Science (Honours)',
  },
  proof: {
    type: 'DataIntegrityProof',
    verificationMethod: 'did:web:example.com#key',
    cryptosuite: 'bbs-2023',
    proofPurpose: 'assertionMethod',
    proofValue: 'eyJhbGciOi',
  },
  identifier: 'mockCredential',
};

const mockCredentialSecond: VerifiableCredential & { identifier?: string } = {
  '@context': ['https://www.context.org/sample'],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  issuanceDate: '2024-07-23T10:01:42Z',
  credentialSubject: {
    worksAt: 'McDonalds',
  },
  proof: {
    type: 'DataIntegrityProof',
    verificationMethod: 'did:web:example.com#key',
    cryptosuite: 'bbs-2023',
    proofPurpose: 'assertionMethod',
    proofValue: 'eyJhbGciOi',
  },
  identifier: 'mockCredentialSecond',
};

const mockPresentation: VerifiablePresentation = {
  '@context': ['https://www.context.org/sample'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [mockCredential],
  id: uuidv4(),
};

describe('Derivation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should throw if claimsToKeep does not contain any claims in the credential', async () => {
    await expect(deriveCredential(mockCredential, { mockCredential: ['cat'] })).rejects.toThrow(
      'Claim cat not found in credential mockCredential'
    );
  });

  it('Should return a derived credential with only the claims specified in claimsToKeep', async () => {
    const { derive } = await import('@digitalbazaar/vc');
    (derive as jest.MockedFunction<typeof derive>).mockResolvedValueOnce({
      ...mockCredential,
      credentialSubject: { degree: 'Bachelor of Computer Science (Honours)' },
    });
    const res = (await deriveCredential(mockCredential, {
      mockCredential: ['degree'],
    })) as VerifiableCredential;
    expect(res.credentialSubject).toStrictEqual({
      degree: 'Bachelor of Computer Science (Honours)',
    });
  });

  it('Deriving a presentation returns a presentation with only the claims specified in claimsToKeep', async () => {
    const { createPresentation } = await import('@digitalbazaar/vc');
    (createPresentation as jest.MockedFunction<typeof createPresentation>).mockResolvedValueOnce({
      ...mockPresentation,
      verifiableCredential: [
        {
          ...mockCredential,
          credentialSubject: { degree: 'Bachelor of Computer Science (Honours)' },
        },
      ],
    } as never);
    const res = (await deriveAndCreatePresentation([mockCredential], {
      mockCredential: ['degree'],
    })) as VerifiablePresentation;
    expect(res.verifiableCredential.length).toBe(1);
    const derivedCredential = res.verifiableCredential[0] as VerifiableCredential;
    expect(derivedCredential.credentialSubject).toStrictEqual({
      degree: 'Bachelor of Computer Science (Honours)',
    });
  });

  it('Deriving a presentation with multiple credentials', async () => {
    const { createPresentation } = await import('@digitalbazaar/vc');
    (createPresentation as jest.MockedFunction<typeof createPresentation>).mockResolvedValueOnce({
      ...mockPresentation,
      verifiableCredential: [mockCredential, mockCredentialSecond],
    } as never);
    const res = await deriveAndCreatePresentation([mockCredential, mockCredentialSecond], {
      mockCredential: [],
      mockCredentialSecond: [],
    });
    expect(res.verifiableCredential).toContainEqual(mockCredential);
    expect(res.verifiableCredential).toContainEqual(mockCredentialSecond);
  });
});
