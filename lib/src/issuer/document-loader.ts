import * as vc from '@digitalbazaar/vc';
import data_integrity_v2 from './contexts/data-integrity-v2.json' assert { type: 'json' };
import credentials_examples from './contexts/examples.json' assert { type: 'json' };
import did from './contexts/did.json' assert { type: 'json' };
import odrl from './contexts/odrl.json' assert { type: 'json' };
import didDoc from '../../../did/src/.well-known/dbfac01cafc6fee9f9956b1ddbe5513a403a0961955a019764a9cba9e4279da2/did.json' assert { type: 'json' };

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
  } else if (url == 'did:web:dbfac01cafc6fee9f9956b1ddbe5513a403a0961955a019764a9cba9e4279da2') {
    return {
      contextUrl: "null",
      documentUrl: url,
      document: didDoc,
    }
  }
  return defaultDocumentLoader(url);
};

export default documentLoader;
