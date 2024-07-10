import * as vc from '@digitalbazaar/vc';
import data_integrity_v2 from './contexts/data-integrity-v2.json' assert { type: 'json' };
import credentials_examples from './contexts/examples.json' assert { type: 'json' };
import did from './contexts/did.json' assert { type: 'json' };
import odrl from './contexts/odrl.json' assert { type: 'json' };
import multikey from './contexts/multikey.json' assert { type: 'json' };
import { driver } from './did-driver/index.js';
const { defaultDocumentLoader } = vc;
const documentLoader = async (url) => {
    if (url === 'https://w3id.org/security/data-integrity/v2') {
        return {
            contextUrl: null,
            documentUrl: url,
            document: data_integrity_v2,
        };
    }
    else if (url === 'https://www.w3.org/2018/credentials/examples/v1') {
        return {
            contextUrl: null,
            documentUrl: url,
            document: credentials_examples,
        };
    }
    else if (url === 'https://www.w3.org/ns/odrl.jsonld') {
        return {
            contextUrl: null,
            documentUrl: url,
            document: odrl,
        };
    }
    else if (url == 'https://www.w3.org/ns/did/v1') {
        return {
            contextUrl: null,
            documentUrl: url,
            document: did,
        };
    }
    else if (url == 'https://w3id.org/security/multikey/v1') {
        return {
            contextUrl: null,
            documentUrl: url,
            document: multikey,
        };
    }
    else if (url.startsWith('did:web:')) {
        const document = await driver().get({ url });
        return {
            contextUrl: null,
            documentUrl: url,
            document: document,
        };
    }
    return defaultDocumentLoader(url);
};
export default documentLoader;
