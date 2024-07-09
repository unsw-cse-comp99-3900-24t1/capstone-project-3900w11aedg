import * as vc from '@digitalbazaar/vc';
import data_integrity_v2 from './contexts/data-integrity-v2.json' assert { type: 'json' };
import credentials_examples from './contexts/examples.json' assert { type: 'json' };
import did from './contexts/did.json' assert { type: 'json' };
import odrl from './contexts/odrl.json' assert { type: 'json' };
import multikey from './contexts/multikey.json' assert { type: 'json' };
import { getResolver } from './did-resolver.js';
import { Resolver } from 'did-resolver';

const webDidResolver = getResolver();
const didResolver = new Resolver(webDidResolver);
//import didDoc from '../../../did/src/.well-known/dbfac01cafc6fee9f9956b1ddbe5513a403a0961955a019764a9cba9e4279da2/did.json' assert { type: 'json' };

const { defaultDocumentLoader } = vc;

const documentLoader = async (url: string) => {
  if (url === 'https://w3id.org/security/data-integrity/v2') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: data_integrity_v2,
    };
  } else if (url === 'https://www.w3.org/2018/credentials/examples/v1') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: credentials_examples,
    };
  } else if (url === 'https://www.w3.org/ns/odrl.jsonld') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: odrl,
    };
  } else if (url == 'https://www.w3.org/ns/did/v1') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: did,
    };
  } else if (url == 'https://w3id.org/security/multikey/v1') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: multikey,
    };
  } else if (url.startsWith('did:web:')) {
    const resolved = await didResolver.resolve(url);
    const document = resolved.didDocument;
    if (!document) {
      throw new Error('No DIDDoc found');
    }

    const publicKey = document.publicKey;
    if (!publicKey) {
      throw new Error('No publicKey found');
    }
    return {
      contextUrl: null,
      documentUrl: url,
      document: url.includes('#') ? document : publicKey[0],
    };
  }
  return defaultDocumentLoader(url);
};

export default documentLoader;
