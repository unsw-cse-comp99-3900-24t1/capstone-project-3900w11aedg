import request from 'supertest';
import app from '../src/index';
import { server } from '../src';
import { afterAll, describe, expect, it, jest } from '@jest/globals';

jest.setTimeout(30000);

const claims = {
  id: 'vp token example',
  input_descriptors: [
    {
      id: 'id card credential',
      format: {
        ldp_vc: {
          proof_type: ['Ed25519Signature2018'],
        },
      },
      constraints: {
        fields: [
          {
            path: ['$.type'],
            filter: {
              type: 'string',
              pattern: 'IDCardCredential',
            },
          },
        ],
      },
    },
  ],
};
const serviceProviderDID = 'did:web:example.com';
const domain = 'localhost';

describe('POST /generate/qr-code', () => {
  afterAll(async () => {
    await server.close();
  });

  it('should respond with a valid status and a QR code URL', async () => {
    const response = await request(app)
      .post('/generate/qr-code')
      .send({ claims, serviceProviderDID, domain });

    expect(response.status).toBe(200);
    expect(response.body.qrCodeUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('should respond with status 400 when DID is invalid', async () => {
    const response = await request(app)
      .post('/generate/qr-code')
      .send({ claims, serviceProviderDID: 'did:example:invalid', domain });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid Service Provider DID');
  });

  it('should respond with status 400 when claims are of invalid structure', async () => {
    const response = await request(app)
      .post('/generate/qr-code')
      .send({ claims: { test: 'structure' }, serviceProviderDID, domain });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid claims');
  });
});
