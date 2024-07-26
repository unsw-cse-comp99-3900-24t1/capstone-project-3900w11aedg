import { beforeEach, jest } from '@jest/globals';
import { UnsignedCredential, VerifiableCredential } from '../types/credentials';
import { KeyPair } from '../types/data';

jest.unstable_mockModule('@digitalbazaar/vc', () => ({
  issue: jest.fn(),
}));

const unsignedCredential: UnsignedCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
  ],
  'type': [
    'VerifiableCredential',
    'AlumniCredential',
  ],
  'issuer': 'https://www.unsw.edu.au/',
  'issuanceDate': '',
  'credentialSubject': {
    'alumniOf': 'University of New South Wales',
    'degree': 'Bachelor of Computer Science (Honours)',
  },
};

const mockCredential: VerifiableCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
  ],
  'type': [
    'VerifiableCredential',
    'AlumniCredential',
  ],
  'issuer': 'https://www.unsw.edu.au/',
  'issuanceDate': '',
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

describe('issuance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should issue a credential', async () => {
    const { issue } = await import('@digitalbazaar/vc');
    (issue as jest.MockedFunction<typeof issue>).mockResolvedValueOnce(mockCredential);
    const { signCredential } = await import('../src/issuer/signing');
    const res = await signCredential(unsignedCredential, {
      signer: () => {
      },
    } as KeyPair);
    expect(res).toStrictEqual(mockCredential);
  });
});