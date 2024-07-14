import fs from 'fs';
import { loadData } from '../data.js';
import { isValidClaim, isValidDomain } from '../validation-helper.js';

export const generateQRCodeUrl = async (
  domain: string, 
  rootDir: string,
  claims: object,
  didURL: string,
  keyPairURL: string
): Promise<string> => {
  const { did } = await loadData(didURL, keyPairURL);

  if (!isValidDomain(domain) || !isValidClaim(claims)) {
    throw new Error('Invalid domain or claims');
  }

  return await requestClaims(domain, rootDir, claims, did);
};

export const requestClaims = async (
  domain: string,
  rootDir: string,
  claims: object,
  did: string
): Promise<string> => {
  const presentationRequest = constructRequest(domain, claims, did);

  const path = rootDir + `/requests`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFileSync(
    rootDir + `/requests/request-data.json`,
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
