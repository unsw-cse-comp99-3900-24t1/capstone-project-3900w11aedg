import { describe, expect, it } from '@jest/globals';
import { Claims } from '../types/ClaimsRequest';
import { generateQRCodeUrl, requestClaims, constructRequest } from '../src/service-provider/request-claims';
import path from 'path';
import fs from 'fs';
import { loadData } from '../src/data';

const rootDir = path.resolve('../service-provider');
const didURL = path.join(rootDir, '/src/did.txt');
const keyPairURL = path.join(rootDir, '/src/keyPair.key');

const domain = 'example.com';
const serviceProviderDID = 'did:web:example.com';
const claims: Claims = {
  "id": "vp token example",
  "input_descriptors": [
    {
      "id": "id card credential",
      "format": {
        "ldp_vc": {
          "proof_type": [
            "DataIntegrityProof"
          ]
        }
      },
      "constraints": {
        "fields": [
          {
            "path": [
              "$.type"
            ],
            "filter": {
              "type": "string",
              "pattern": "IDCardCredential"
            }
          }
        ]
      }
    }
  ]
};
const mockRequest = {
  "query": [
    {
      "domain": "localhost:3333",
      "did": (await loadData(didURL, keyPairURL)).did,
      "claims": claims,
      "url": "https://localhost:3333/claims/verify"
    }
  ]
}

describe('Request claims', () => {
  describe('generateQRCodeUrl', () => {
    it('should generate a valid QR code URL', async () => {    
      const result = await generateQRCodeUrl(domain, 'rootDir', claims, didURL, keyPairURL);
      expect(result).toBe(`http://${domain}/request-claims/request-data`);
    });

    it('should throw an error if the domain is invalid', async () => {
      await expect(generateQRCodeUrl('invalidDomain', 'rootDir', claims, didURL, keyPairURL))
        .rejects
        .toThrow('Invalid domain or claims');
    });

    it('should throw an error if the didURL or keyPairURL are invalid', async () => {
      await expect(generateQRCodeUrl(domain, 'rootDir', claims, 'invalidDidURL', 'invalidKeyPairURL'))
        .rejects
        .toThrow('Error loading DID');
    });
  });

  describe('requestClaims', () => {
    it('should save the request and return the link to the file', async () => {
      const result = await requestClaims(domain, 'rootDir', claims, serviceProviderDID);
      const request = fs.readFileSync(
        rootDir + '/requests/request-data.json',
        'utf8',
      );
      expect(JSON.parse(request)).toStrictEqual(mockRequest);
      expect(result).toBe(`http://${domain}/request-claims/request-data`);
    });
  });

  describe('constructRequest', () => {
    it('should return a request object', () => {
      const result = constructRequest(domain, claims, serviceProviderDID);

      expect(typeof result).toBe("object");
      expect(result).toHaveProperty('query');
      expect(result.query[0]).toHaveProperty('domain');
      expect(result.query[0]).toHaveProperty('did');
      expect(result.query[0]).toHaveProperty('claims');
      expect(result.query[0]).toHaveProperty('url');
    });
  });

});
