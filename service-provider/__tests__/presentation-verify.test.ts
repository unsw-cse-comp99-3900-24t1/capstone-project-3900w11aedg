import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import base64url from 'base64-url';
import { v4 as uuidv4 } from 'uuid';

jest.unstable_mockModule('../../lib/src/service-provider/verification', () => ({
  verifyDocument: jest.fn(),
}));

let app = await import('../src/index');
let { server } = await import('../src');

const restartServer = async () => {
  await server.close();
  jest.resetModules();
  jest.clearAllMocks();
  app = await import('../src/index');
  ({ server } = await import('../src'));
};

const mockCredential = {
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
  },
  'proof': {
    'type': 'DataIntegrityProof',
    'verificationMethod': 'did:web:example.com#key',
    'cryptosuite': 'bbs-2023',
    'proofPurpose': 'assertionMethod',
    'proofValue': 'eyJhbGciOi',
  },
};
const mockPresentation = {
  '@context': [
    'https://www.context.org/sample',
  ],
  'type': [
    'VerifiablePresentation',
  ],
  'verifiableCredential': [mockCredential],
  'id': uuidv4(),
};
const vp_token = base64url.encode(JSON.stringify(mockPresentation));

describe('POST /presentation/verify', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    await server.close();
  });

  it('should respond with status 200 and a valid result', async () => {
    const { verifyDocument } = await import('../../lib/src/service-provider/verification');
    (verifyDocument as jest.MockedFunction<typeof verifyDocument>).mockResolvedValue({
      verified: true,
      presentationResult: mockPresentation,
      credentialResults: [{ verified: true }],
      error: {},
    });
    const response = await request(app.default).post('/presentation/verify').send({ vp_token });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ verified: true });
  });

  it('should respond with status 400 if no token is found', async () => {
    const response = await request(app.default).post('/presentation/verify').send({});
    expect(response.status).toBe(400);
  });

  it('should respond with status 400 if token is invalid', async () => {
    const response = await request(app.default).post('/presentation/verify').send({ vp_token: 'invalidTokenFormat' });
    expect(response.status).toBe(400);
  });

  it('should respond with status 400 if the verification failed', async () => {
    const { verifyDocument } = await import('../../lib/src/service-provider/verification');
    (verifyDocument as jest.MockedFunction<typeof verifyDocument>).mockResolvedValue({
      verified: false,
      presentationResult: mockPresentation,
      credentialResults: [{ verified: false }],
      error: new TypeError(),
    });
    const response = await request(app.default).post('/presentation/verify').send({ vp_token });
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ verified: false });
  });
});
