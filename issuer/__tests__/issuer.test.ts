import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest.fn().mockReturnValue(JSON.stringify({
      'credential_offer': [
        {
          'credential_issuer': 'localhost:3210',
          'credential_configurations_supported': {},
          "authorization_endpoint": "http://localhost:3210/authorise",
          "credential_endpoint": "http://localhost:3210/credential/offer"
        },
      ],
    })),
  },
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

describe('issuer', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    await server.close();
  });

  it('GET /.well-known/openid-credential-issuer should respond with a valid status and metadata', async () => {
    const response = await request(app.default).get(`/.well-known/openid-credential-issuer`);

    expect(response.status).toBe(200);

    const result = response.body;
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('credential_offer');
    expect(result.credential_offer).toHaveProperty('credential_issuer');
    expect(result.credential_offer).toHaveProperty('credential_configurations_supported');
    expect(result.credential_offer).toHaveProperty('authorization_endpoint');
    expect(result.credential_offer).toHaveProperty('credential_endpoint');
  });

  it('POST /authorise should return 400 if response_type is missing', async () => {
    const response = await request(app.default).post('/authorise').send({ client_id: 'test-client', authorization_details: 'details' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Response type must be "code"');
  });

  it('POST /authorise should return 400 if response_type is not "code"', async () => {
    const response = await request(app.default)
      .post('/authorise')
      .send({ response_type: 'token', client_id: 'test-client', authorization_details: 'details' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Response type must be "code"');
  });

  it('POST /authorise should return 400 if client_id is missing', async () => {
    const response = await request(app.default)
      .post('/authorise')
      .send({ response_type: 'code', authorization_details: 'details' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Client identifier must be provided');
  });

  it('POST /authorise should return 400 if authorization_details is missing', async () => {
    const response = await request(app.default)
      .post('/authorise')
      .send({ response_type: 'code', client_id: 'test-client' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Authorisation details must be provided');
  });

  it('POST /credential/offer should return 400 if auth_code is wrong', async () => {
    const response = await request(app.default)
      .post('/credential/offer')
      .send({ auth_code: 'code', credential_identifier: 'test-client' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Authorization token is invalid');
  });
});
