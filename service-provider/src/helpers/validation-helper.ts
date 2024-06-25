import { Resolver } from 'did-resolver';
import { getResolver } from 'web-did-resolver';
import claimsSchema from '../schema';
import { Draft07 } from 'json-schema-library';

export async function isValidDID(did: string) {
    const resolver = new Resolver(getResolver());
    const didDoc = await resolver.resolve(did);
    return didDoc.didResolutionMetadata.error === 'notFound';
}

export function isValidClaim(claims: any) {
    const jsonSchema = new Draft07(claimsSchema);
    return jsonSchema.isValid(claims);
}

export function isValidDomain(domain: string) {
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domain === 'localhost' || domainRegex.test(domain);
};