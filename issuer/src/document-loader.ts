import * as vc from '@digitalbazaar/vc';
import data_integrity_v2 from './contexts/data-integrity-v2.json';
import credentials_examples from './contexts/examples.json';

const { defaultDocumentLoader } = vc;

const documentLoader = async (url: string) => {
  if (url === 'https://w3id.org/security/data-integrity/v2') {
    return {
      contextUrl: null,
      documentUrl: url,
      document: data_integrity_v2
    };
  } else if (url === "https://www.w3.org/2018/credentials/examples/v1") {
    return {
        contextUrl: null,
        documentUrl: url,
        document: credentials_examples
    };
  }
  return defaultDocumentLoader(url);
};

export default documentLoader;
