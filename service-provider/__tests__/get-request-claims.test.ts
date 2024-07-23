import { afterEach, describe, expect, it, jest } from '@jest/globals';
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

const app = await import('../src/index');
const { server } = await import('../src');


describe('GET /request-claims/:filename', () => {
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


///////////////////////////////////////////////////////////////////////////
// TODO: These tests are outdated since /generate/qr-code has been removed
// and turned into a function. Use these to test other routes.
///////////////////////////////////////////////////////////////////////////

// jest.unstable_mockModule('../../lib/src/validation-helper', () => ({
//   isValidClaim: jest.fn(),
//   isValidDomain: jest.fn(),
//   isValidDID: jest.fn(),
// }));

// jest.unstable_mockModule('../../lib/src/data', () => ({
//   loadData: jest.fn(),
//   saveData: jest.fn(),
// }));

// const { isValidClaim, isValidDomain } = await import('../../lib/src/validation-helper');
// const { loadData } = await import('../../lib/src/data');
// const app = await import('../src/index');
// const { server } = await import('../src/');

// const claims = {
//   id: 'vp token example',
//   input_descriptors: [
//     {
//       id: 'id card credential',
//       format: {
//         ldp_vc: {
//           proof_type: ['Ed25519Signature2018'],
//         },
//       },
//       constraints: {
//         fields: [
//           {
//             path: ['$.type'],
//             filter: {
//               type: 'string',
//               pattern: 'IDCardCredential',
//             },
//           },
//         ],
//       },
//     },
//   ],
// };

// const domain = 'localhost';

// describe('POST /generate/qr-code', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     jest.resetAllMocks();
//     jest.resetModules();

//     jest.mocked(loadData).mockResolvedValue({
//       did: 'did:web:example.com',
//       keyPair: { publicKey: 'publicKey', secretKey: 'secretKey' },
//     });
//   });

//   afterEach(async () => {
//     await server.close();
//   });

//   it('should respond with a valid status and a QR code URL', async () => {
//     jest.mocked(isValidDomain).mockReturnValue(true);
//     jest.mocked(isValidClaim).mockReturnValue(true);
//     const response = await request(app.default).post('/generate/qr-code').send({ claims, domain });
//     expect(response.status).toBe(200);
//     expect(response.body.qrCodeUrl).toMatch(/^data:image\/png;base64,/);
//   });

//   it('should respond with status 400 when DID is invalid', async () => {
//     jest.mocked(loadData).mockRejectedValue(new Error);
//     jest.mocked(isValidDomain).mockReturnValue(true);
//     jest.mocked(isValidClaim).mockReturnValue(true);
//     const response = await request(app.default).post('/generate/qr-code').send({ claims, domain });
//     expect(response.status).toBe(400);
//   });

//   it('should respond with status 400 when claims are of invalid structure', async () => {
//     jest.mocked(isValidDomain).mockReturnValue(true);
//     jest.mocked(isValidClaim).mockReturnValue(false);
//     const response = await request(app.default)
//       .post('/generate/qr-code')
//       .send({ claims: { test: 'structure' }, domain });

//     expect(response.status).toBe(400);
//   });
// });
