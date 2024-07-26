import { afterEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import { KeyPair } from '../../lib/types/data';

jest.unstable_mockModule('axios', () => ({
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

jest.unstable_mockModule('../../lib/src/data', () => ({
  loadData: jest.fn(),
  saveData: jest.fn(),
}));

const mockCredential = {
  '@context': [
    'https://www.context.org/sample',
  ],
  'type': [
    'VerifiableCredential',
  ],
  'issuer': 'did:web:example.com',
  'issuanceDate': '2024-07-23T10:01:42Z',
  'credentialSubject': {
    'alumniOf': 'University of New South Wales',
  },
  'proof': {
    'type': 'DataIntegrityProof',
    'verificationMethod': 'did:web:example.com#key',
    'cryptosuite': 'bbs-2023',
    'proofPurpose': 'assertionMethod',
    'proofValue': 'eyJhbGciOi',
  },
};

const mockMetadata = {
  'credential_issuer': 'http://localhost:3210',
  'credential_configurations_supported': {
    'UniversityDegree_LDP_VC': {
      'format': 'ldp-vc',
      'cryptographic_binding_methods_supported': [
        'did:web:example#key-1',
      ],
      'credential_signing_alg_values_supported': [
        'BBS',
      ],
      'credential_definition': {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
        ],
        'type': [
          'VerifiableCredential',
          'UniversityDegreeCredential',
        ],
        'credentialSubject': {
          'alumniOf': {
            'mandatory': true,
            'display': {
              'name': 'Alumni of UNSW',
            },
          },
        },
      },
      'display': [
        {
          'name': 'University Graduate Credential',
          'logo': {
            'uri': 'https://universitiesaustralia.edu.au/wp-content/uploads/2019/05/UNSW-1-300x300.png',
          },
          'description': 'The holder of this credential is a graduate of UNSW.',
        },
      ],
    },
    'MastersDegree_LDP_VC': {
      'format': 'ldp-vc',
      'cryptographic_binding_methods_supported': [
        'did:web:example#key-2',
      ],
      'credential_signing_alg_values_supported': [
        'BBS',
      ],
      'credential_definition': {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://www.w3.org/2018/credentials/examples/v1',
        ],
        'type': [
          'VerifiableCredential',
          'MastersDegreeCredential',
        ],
        'credentialSubject': {
          'alumniOf': {
            'mandatory': true,
            'display': {
              'name': 'Alumni of UNSW',
            },
          },
        },
      },
      'display': [
        {
          'name': 'Masters Degree Credential',
          'logo': {
            'uri': 'https://universitiesaustralia.edu.au/wp-content/uploads/2019/05/UNSW-1-300x300.png',
          },
          'description': 'The holder of this credential has earned a master\'s degree from UNSW.',
        },
      ],
    },
  },
  'display': {
    'name': 'University of New South Wales',
    'logo': {
      'uri': 'https://scienceandtechnologyaustralia.org.au/wp-content/uploads/2023/01/Untitled-design-55.png',
    },
  },
  'authorization_endpoint': 'http://localhost:3210/authorise',
  'credential_endpoint': 'http://localhost:3210/credential/offer',
};

let app = await import('../src/index');
let { server } = await import('../src');

const restartServer = async () => {
  await server.close();
  jest.resetModules();
  jest.clearAllMocks();
  app = await import('../src/index');
  ({ server } = await import('../src'));
};

describe('POST /issuer/poll', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    await server.close();
  });

  afterAll(async () => {
    await server.close();
  });

  it('No issuer URL passed in', async () => {
    const res = await request(app.default).post('/issuer/poll');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Must provide target Issuer\'s URL');
  });

  it('Returns issuer metadata', async () => {
    const axios = (await import('axios')).default;
    const { get } = axios;
    (get as jest.MockedFunction<typeof get>).mockResolvedValueOnce({ data: mockMetadata });
    const res = await request(app.default).post('/issuer/poll').send({ issuerUrl: 'http://localhost:3210/.well-known/openid-credential-issuer' });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(mockMetadata);
  });
});

describe('POST /credential/request', () => {
  beforeEach(async () => {
    await restartServer();
  });

  afterEach(async () => {
    await server.close();
  });

  afterAll(async () => {
    await server.close();
  });

  it('Missing parameters', async () => {
    let res = await request(app.default).post('/credential/request');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credential identifier, authorization endpoint, or credential endpoint');
    res = await request(app.default).post('/credential/request').send({ credential_identifier: 'UniversityDegree_LDP_VC' });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credential identifier, authorization endpoint, or credential endpoint');
    res = await request(app.default).post('/credential/request').send({ authorization_endpoint: 'http://localhost:3210/authorise' });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credential identifier, authorization endpoint, or credential endpoint');
    res = await request(app.default).post('/credential/request').send({
      credential_identifier: 'UniversityDegree_LDP_VC',
      credential_endpoint: 'http://localhost:3210/credential/offer',
    });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Missing credential identifier, authorization endpoint, or credential endpoint');
  });

  it('Returns a credential', async () => {
    const { loadData } = await import('../../lib/src/data');
    (loadData as jest.MockedFunction<typeof loadData>).mockResolvedValueOnce({
      did: 'did:web:example',
      keyPair: {} as KeyPair,
    });
    const axios = (await import('axios')).default;
    const { post } = axios;
    (post as jest.MockedFunction<typeof post>).mockResolvedValueOnce({
      data: {
        code: '12345',
      },
    }).mockResolvedValueOnce(
      {
        data: {
          credential: mockCredential,
        },
      });

    const res = await request(app.default).post('/credential/request').send({
      credential_identifier: 'UniversityDegree_LDP_VC',
      credential_endpoint: 'http://localhost:3210/credential/offer',
      authorization_endpoint: 'http://localhost:3210/authorise',
    });
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual(mockCredential);
  });
});