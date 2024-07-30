import { afterEach, describe, it, jest } from '@jest/globals';
import request from 'supertest';
import { VerifiableCredential } from '../../lib/types/credentials';
import { v4 as uuidv4 } from 'uuid';

jest.unstable_mockModule('../../lib/src/backend/presentations', () => ({
  deriveAndCreatePresentation: jest.fn(),
}));

jest.unstable_mockModule('axios', () => ({
  default: {
    post: jest.fn(),
  },
}));

const mockCredential: VerifiableCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
    'https://w3id.org/security/data-integrity/v2',
  ],
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer: 'did:web:random',
  issuanceDate: '2024-07-17T00:45:58Z',
  credentialSubject: {
    alumniOf: 'University of New South Wales',
    degree: 'Bachelor of Computer Science (Honours)',
  },
  proof: {
    type: 'DataIntegrityProof',
    verificationMethod: 'did:web:example.com',
    cryptosuite: 'bbs-2023',
    proofPurpose: 'assertionMethod',
    proofValue:
      'u2V0ChVhQlfPqJYDn9CGSsOjoFuWjDhDKJuiIYxL-8N8Y_Vtr8qVmwwwb0qFXYzxYOPVfh-6ZQy1qHhPAasetBjb3w0PoZ5IN_eaoosYGwKntG0QFyV9YQKsM9n7NaM9xqghRfvkEUXfa_4HrZy5hV6EbGDyu_RdmxrB_jxPMJBo8O5QaVN_ZgO9NVqPLpiOrrpoHsjHipblYYI69z7jeXZb1bsoHv2a60GX-WSHCQ5q67_cyNjo5Ru-sKlHitsZTa7iM27HjwxE0CA8eFWSEYC4b8lykA81ettkT2pamEDbrGdGTrIUn1eYizWNGU1GbOHXrBaGBCxhzzVggQHd1gwBtO5WaO4B7uKWVqPz3YhuBUqLFxE7sXgpFJNyCbS9pc3N1YW5jZURhdGVnL2lzc3Vlcg',
  },
};

const credentialMissingFields = {
  '@context': ['https://www.context.org/sample'],
  type: ['VerifiableCredential'],
  issuer: 'did:web:example.com',
  issuanceDate: '2024-07-23T10:01',
};

const mockPresentation = {
  '@context': ['https://www.context.org/sample'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [mockCredential],
  id: uuidv4(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

const restartServer = async () => {
  if (server) {
    await server.close();
  }
  jest.resetModules();
  jest.clearAllMocks();
  app = await import('../src/index');
  ({ server } = await import('../src'));
};

describe('POST /presentation/create', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  it('Credentials or serviceProviderUrl is missing', async () => {
    let res = await request(app.default).post('/presentation/create');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credentials or service provider URL');
    res = await request(app.default)
      .post('/presentation/create')
      .send({ credentials: [mockCredential] });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credentials or service provider URL');
    res = await request(app.default)
      .post('/presentation/create')
      .send({ serviceProviderUrl: 'http://example.com' });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credentials or service provider URL');
  });

  it('Credentials or serviceProviderUrl are in the wrong format', async () => {
    const res = await request(app.default)
      .post('/presentation/create')
      .send({
        credentials: [credentialMissingFields],
        serviceProviderUrl: 'htasdasdastp://sdasd..om',
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid credentials format or URL');
  });

  it('ClaimsToKeep exists but is empty or not an array', async () => {
    let res = await request(app.default)
      .post('/presentation/create')
      .send({
        credentials: [mockCredential],
        serviceProviderUrl: 'http://example.com',
        claimsToKeep: 'not an array',
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid claims to keep format');
    res = await request(app.default)
      .post('/presentation/create')
      .send({
        credentials: [mockCredential],
        serviceProviderUrl: 'https://example.com',
        claimsToKeep: [],
      });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid claims to keep format');
  });

  it('Creates a presentation and is sent and verified by the service provider', async () => {
    const { deriveAndCreatePresentation } = await import('../../lib/src/backend/presentations');
    (
      deriveAndCreatePresentation as jest.MockedFunction<typeof deriveAndCreatePresentation>
    ).mockResolvedValueOnce(mockPresentation);
    const axios = (await import('axios')).default;
    const { post } = axios;
    (post as jest.MockedFunction<typeof post>).mockResolvedValueOnce({
      status: 200,
      data: { valid: true },
    });
    const res = await request(app.default)
      .post('/presentation/create')
      .send({
        credentials: [mockCredential],
        serviceProviderUrl: 'http://example.com',
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ verified: true });
  });

  it('Creates a presentation and is sent to service provider but is invalid', async () => {
    const { deriveAndCreatePresentation } = await import('../../lib/src/backend/presentations');
    (
      deriveAndCreatePresentation as jest.MockedFunction<typeof deriveAndCreatePresentation>
    ).mockResolvedValueOnce(mockPresentation);
    const axios = (await import('axios')).default;
    const { post } = axios;
    (post as jest.MockedFunction<typeof post>).mockResolvedValueOnce({
      status: 400,
      data: { valid: false },
    });
    const res = await request(app.default)
      .post('/presentation/create')
      .send({
        credentials: [
          {
            ...mockCredential,
            proof: {
              ...mockCredential.proof,
              proofValue: 'invalid proof value',
            },
          },
        ],
        serviceProviderUrl: 'http://example.com',
      });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ verified: false });
  });

  it('Creates a presentation but fails to send to service provider', async () => {
    const { deriveAndCreatePresentation } = await import('../../lib/src/backend/presentations');
    (
      deriveAndCreatePresentation as jest.MockedFunction<typeof deriveAndCreatePresentation>
    ).mockResolvedValueOnce(mockPresentation);
    const axios = (await import('axios')).default;
    const { post } = axios;
    (post as jest.MockedFunction<typeof post>).mockResolvedValueOnce({ status: 500 });
    const res = await request(app.default)
      .post('/presentation/create')
      .send({
        credentials: [
          {
            ...mockCredential,
            proof: {
              ...mockCredential.proof,
              proofValue: 'invalid proof value',
            },
          },
        ],
        serviceProviderUrl: 'http://example.com',
      });
    expect(res.status).toBe(500);
    expect(res.text).toBe('Error sending presentation to service provider');
  });
});
