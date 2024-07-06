import { isValidClaim, isValidDomain } from '../validation-helper.js';
import fs from 'fs';
import { saveQRCode, urlToQRCode } from '../qr.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const requestClaims = async (
  domain: string,
  claims: object,
  did: string
): Promise<string> => {
  if (!isValidDomain(domain) || !isValidClaim(claims)) {
    throw new Error('Invalid domain or claims');
  }

  const presentationRequest = constructRequest(domain, claims, did);

  const path = __dirname + `/requests`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  fs.writeFileSync(
    __dirname + `/requests/request-data.json`,
    JSON.stringify(presentationRequest, null, 2)
  );

  const requestURI = `http://${domain}/request-claims/request-data`;
  console.log(requestURI);
  const qrCodeUrl = await urlToQRCode(requestURI);
  await saveQRCode(qrCodeUrl, 'request-data.png');
  return qrCodeUrl;
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
