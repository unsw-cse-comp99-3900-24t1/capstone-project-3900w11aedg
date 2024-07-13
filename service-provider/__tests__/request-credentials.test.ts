import { expect, test } from '@jest/globals';

test('sample', () => {
  expect(1).toBe(1);
});

///////////////////////////////////////////////////////////////////////////
// TODO: These tests are outdated since /generate/qr-code has been removed
// and turned into a function. Use these to test other routes.
///////////////////////////////////////////////////////////////////////////

// import { describe, it, jest, expect, beforeEach, afterEach } from '@jest/globals';
// import request from 'supertest';

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
