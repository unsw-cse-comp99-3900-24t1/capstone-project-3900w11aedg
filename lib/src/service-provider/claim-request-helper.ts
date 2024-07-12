import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { loadData } from '../data.js';
import { isValidClaim, isValidDomain } from '../validation-helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQRCodeUrl = async (
  domain: string, 
  claims: object,
  didURL: string,
  keyPairURL: string
): Promise<string> => {
  const { did } = await loadData(didURL, keyPairURL);

  if (!isValidDomain(domain) || !isValidClaim(claims)) {
    throw new Error('Invalid domain or claims');
  }

  return await requestClaims(domain, claims, did);
};

export const requestClaims = async (
  domain: string,
  claims: object,
  did: string
): Promise<string> => {
  const presentationRequest = constructRequest(domain, claims, did);

  const path = __dirname + `/requests`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFileSync(
    __dirname + `/requests/request-data.json`,
    JSON.stringify(presentationRequest, null, 2)
  );

  return `http://${domain}/request-claims/request-data`;
};

export const constructRequest = (domain: string, claims: object, serviceProviderDID: string) => {
  const presentationURL = `https://${domain}/claims/verify`;

  return {
    query: [
      {
        domain,
        did: serviceProviderDID,
        claims,
        url: presentationURL,
      },
    ],
  };
};
