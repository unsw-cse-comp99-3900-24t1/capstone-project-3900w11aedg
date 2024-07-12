import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import claimsSchema from './schema.js';
import js from 'json-schema-library';

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
