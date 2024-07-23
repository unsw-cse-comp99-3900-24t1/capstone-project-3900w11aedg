import * as fs from 'fs';
import { loadData } from '../data.js';
import { isValidClaim, isValidDomain } from '../validation-helper.js';
import { Claims, ClaimsRequest } from '../../types/ClaimsRequest.js';

export const generateQRCodeUrl = async (
  domain: string,
  rootDir: string,
  claims: Claims,
  didURL: string,
  keyPairURL: string,
): Promise<string> => {
  let did: string;
  try {
    ({ did } = await loadData(didURL, keyPairURL));
  } catch (err) {

    throw new Error('Error loading DID.');
  }
  if (!isValidDomain(domain) || !isValidClaim(claims)) {
    throw new Error('Invalid domain or claims');
  }
  return await requestClaims(domain, rootDir, claims, did);
};

export const requestClaims = async (
  domain: string,
  rootDir: string,
  claims: Claims,
  did: string,
): Promise<string> => {
  const presentationRequest = constructRequest(domain, claims, did);

  const path = rootDir + `/requests`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFileSync(
    rootDir + `/requests/request-data.json`,
    JSON.stringify(presentationRequest, null, 2),
  );

  return `http://${domain}/request-claims/request-data`;
};

export const constructRequest = (domain: string, claims: Claims, serviceProviderDID: string): ClaimsRequest => {
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
