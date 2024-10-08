import claimsSchema from './schema.js';
import js from 'json-schema-library';
import { _checkCredential } from '@digitalbazaar/vc';
import base64url from 'base64-url';

const { Draft07 } = js;

export function isValidClaim(claims: object): boolean {
  if (Object.keys(claims).length === 0) return false;
  const jsonSchema = new Draft07(claimsSchema);
  return jsonSchema.isValid(claims);
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const localhostRegex = /^localhost:\d+$/;
  return localhostRegex.test(domain) || domainRegex.test(domain);
}

export function isValidUrl(url: string): boolean {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

export function areValidCredentials(credentials: Array<object>): boolean {
  try {
    credentials.map(credential => _checkCredential({ credential }));
    return true;
  } catch {
    return false;
  }
}

export function decodeToken(token: string): object | null {
  try {
    const dataString = base64url.decode(token);
    return JSON.parse(dataString);
  } catch {
    return null;
  }
}
