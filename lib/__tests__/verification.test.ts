import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';

jest.unstable_mockModule('@digitalbazaar/vc', () => ({
  verify: jest.fn(),
  verifyCredential: jest.fn(),
}));

const { verify, verifyCredential } = await import('@digitalbazaar/vc');
const { verifyDocument } = await import('../src/service-provider/verification.js');

const mockCredential = {
  "@context": [
    "https://www.context.org/sample"
  ],
  "type": [
    "VerifiableCredential"
  ],
  "issuer": "did:web:example.com",
  "issuanceDate": "2024-07-23T10:01:42Z",
  "credentialSubject": {
    "alumniOf": "University of New South Wales",
  },
  "proof": {
    "type": "DataIntegrityProof",
    "verificationMethod": "did:web:example.com#key",
    "cryptosuite": "bbs-2023",
    "proofPurpose": "assertionMethod",
    "proofValue": "eyJhbGciOi"
  }
}
const mockPresentation = {
  "@context": [
    "https://www.context.org/sample"
  ],
  "type": [
    "VerifiablePresentation"
  ],
  "verifiableCredential": [mockCredential],
  "id": uuidv4()
}

describe('Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return a verified result if presentation is verified', async () => {
    (verify as jest.MockedFunction<typeof verify>).mockResolvedValue({ 
      verified: true,
      presentationResult: mockPresentation,
      credentialResults: [{verified: true}],
      error: {}
    });
    const result = await verifyDocument(mockPresentation, true);
    expect(result.verified).toBe(true);
  });

  it('should return a false result if presentation is not verified', async () => {
    (verify as jest.MockedFunction<typeof verify>).mockResolvedValue({ 
      verified: false,
      presentationResult: mockPresentation,
      credentialResults: [{verified: false}],
      error: new TypeError()
    });
    const result = await verifyDocument(mockPresentation, true);
    expect(result.verified).toBe(false);
  });

  it('should return a verified result if credential is verified', async () => {
    (verifyCredential as jest.MockedFunction<typeof verifyCredential>).mockResolvedValue({ 
      verified: true,
      statusResult: {},
      results: [{verified: true}],
      error: {}
    });
    const result = await verifyDocument(mockCredential);
    expect(result.verified).toBe(true);
  });

  it('should return a false result if credential is not verified', async () => {
    (verifyCredential as jest.MockedFunction<typeof verifyCredential>).mockResolvedValue({ 
      verified: false,
      statusResult: {},
      results: [{verified: false}],
      error: new TypeError()
    });
    const result = await verifyDocument(mockCredential);
    expect(result.verified).toBe(false);
  });
});