import { jest } from '@jest/globals';
import { KeyPair } from '../../lib/types/data';
import { DIDDocument } from 'did-resolver';
import request from 'supertest';

jest.unstable_mockModule('../../lib/src/key', () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule('../../lib/src/upload-did-document', () => ({
  default: jest.fn(),
}));

jest.unstable_mockModule('../../lib/src/data', () => ({
  loadData: jest.fn(),
  saveData: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let app: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

const fakeKeyPair = {
  keyPair: {
    signer: () => {
    },
  } as KeyPair, did: 'did:example:123', didDocument: { id: 'did:example:123' } as DIDDocument,
};

const restartServer = async () => {
  if (server) {
    await server.close();
  }
  jest.resetModules();
  jest.clearAllMocks();
  app = await import('../src/index');
  ({ server } = await import('../src'));
};

describe('POST /generate/did', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    if (server) {
      await server.close();
    }
  });

  it('Should create DID', async () => {
    const generateKeyPair = (await import('../../lib/src/key')).default;
    (generateKeyPair as jest.MockedFunction<typeof generateKeyPair>).mockResolvedValueOnce(fakeKeyPair);
    const response = await request(app.default).post('/generate/did');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('did');
    expect(response.body.did).toStrictEqual('did:example:123');
  });

  it('Should fail if document was not uploaded', async () => {
    const generateKeyPair = (await import('../../lib/src/key')).default;
    (generateKeyPair as jest.MockedFunction<typeof generateKeyPair>).mockResolvedValueOnce(fakeKeyPair);
    const uploadDIDDocument = (await import('../../lib/src/upload-did-document')).default;
    (uploadDIDDocument as jest.MockedFunction<typeof uploadDIDDocument>).mockRejectedValueOnce(new Error('Document not uploaded'));
    const response = await request(app.default).post('/generate/did');
    expect(response.status).toBe(500);
  });
});