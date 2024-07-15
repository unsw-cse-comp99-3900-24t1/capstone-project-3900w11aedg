import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import claimsSchema from './schema.js';
import js from 'json-schema-library';
import { _checkCredential } from '@digitalbazaar/vc';

const { Draft07 } = js;

export async function isValidDID(did: string) {
  const resolver = new Resolver(getResolver());
  const didDoc = await resolver.resolve(did);
  return didDoc.didResolutionMetadata.error === 'notFound';
}

export function isValidClaim(claims: object) {
  if (Object.keys(claims).length === 0) return false;
  const jsonSchema = new Draft07(claimsSchema);
  return jsonSchema.isValid(claims);
}

export function isValidDomain(domain: string) {
  const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const localhostRegex = /^localhost:\d+$/;
  return localhostRegex.test(domain) || domainRegex.test(domain);
}

export function isValidVPToken(vp_token: string) {
  const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
  return base64Regex.test(vp_token);
}

export function isValidUrl(url: string) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

export function areValidCredentials(credentials: Array<object>): boolean {
  try {
    credentials.map(credential => _checkCredential({credential}));
    return true;
  } catch {
    return false;
  }
}