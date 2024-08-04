import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn().mockReturnValue(true),
    readFileSync: jest.fn().mockReturnValue(JSON.stringify({
      'query': [
        {
          'domain': 'localhost:3333',
          'did': 'did:web:example.com',
          'claims': {
            'id': 'vp token example',
            'input_descriptors': [
              {
                'id': 'id card credential',
                'format': {
                  'ldp_vc': {
                    'proof_type': [
                      'DataIntegrityProof',
                    ],
                  },
                },
                'constraints': {
                  'fields': [
                    {
                      'path': [
                        '$.type',
                      ],
                      'filter': {
                        'type': 'string',
                        'pattern': 'IDCardCredential',
                      },
                    },
                  ],
                },
              },
            ],
          },
          'url': 'https://localhost:3333/claims/verify',
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

describe('GET /request-claims/:filename', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    await server.close();
  });

  it('should respond with a valid status and a claims request', async () => {

    const filename = 'request-data';
    const response = await request(app.default).get(`/request-claims/${filename}`);

    expect(response.status).toBe(200);

    const result = response.body;
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('query');
    expect(result.query[0]).toHaveProperty('domain');
    expect(result.query[0]).toHaveProperty('did');
    expect(result.query[0]).toHaveProperty('claims');
    expect(result.query[0]).toHaveProperty('url');
  });

  it('should respond with status 500 if the file read failed', async () => {
    jest.resetAllMocks();
    const response = await request(app.default).get(`/request-claims/invalid`);
    expect(response.status).toBe(500);
  });

});
