import { describe, expect, it, jest } from '@jest/globals';
import { Claims } from '../types/ClaimsRequest';
import path from 'path';

const rootDir = path.resolve('../service-provider');
const didURL = path.join(rootDir, 'did.txt');
const keyPairURL = path.join(rootDir, 'keyPair.key');

jest.unstable_mockModule('../src/data', () => ({
  loadData: jest.fn(),
}));

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
    mkdirSync: jest.fn(),
  },
}));

const { loadData } = await import('../src/data');
const { generateQRCodeUrl, requestClaims, constructRequest } = await import('../src/service-provider/request-claims');


const domain = 'example.com';
const serviceProviderDID = 'did:web:example.com';
const claims: Claims = {
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
};

const mockRequest = {
  'query': [
    {
      'domain': 'localhost:3333',
      'did': 'did:web:example.com',
      'claims': claims,
      'url': 'https://localhost:3333/claims/verify',
    },
  ],
};

describe('Request claims', () => {
  describe('generateQRCodeUrl', () => {
    it('should generate a valid QR code URL', async () => {
      (loadData as jest.MockedFunction<typeof loadData>).mockResolvedValueOnce({
        did: 'did:web:example.com',
        keyPair: null,
      });
      const result = await generateQRCodeUrl(domain, 'test-output', claims, didURL, keyPairURL);
      expect(result).toBe(`http://${domain}/request-claims/request-data`);
    });

    it('should throw an error if the domain is invalid', async () => {
      (loadData as jest.MockedFunction<typeof loadData>).mockResolvedValueOnce({
        did: 'did:web:example.com',
        keyPair: null,
      });
      await expect(generateQRCodeUrl('invalidDomain', 'test-output', claims, didURL, keyPairURL))
        .rejects
        .toThrow('Invalid domain or claims');
    });

    it('should throw an error if the didURL or keyPairURL are invalid', async () => {
      await expect(generateQRCodeUrl(domain, 'test-output', claims, 'invalidDidURL', 'invalidKeyPairURL'))
        .rejects
        .toThrow('Error loading DID');
    });
  });

  describe('requestClaims', () => {
    it('should save the request and return the link to the file', async () => {
      const result = await requestClaims(domain, 'test-output', claims, serviceProviderDID);
      expect({
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
      }).toStrictEqual(mockRequest);
      expect(result).toBe(`http://${domain}/request-claims/request-data`);
    });
  });

  describe('constructRequest', () => {
    it('should return a request object', () => {
      const result = constructRequest(domain, claims, serviceProviderDID);

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('query');
      expect(result.query[0]).toHaveProperty('domain');
      expect(result.query[0]).toHaveProperty('did');
      expect(result.query[0]).toHaveProperty('claims');
      expect(result.query[0]).toHaveProperty('url');
    });
  });

});
