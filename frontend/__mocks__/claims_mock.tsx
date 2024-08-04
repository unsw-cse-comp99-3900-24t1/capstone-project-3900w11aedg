import { ClaimsRequest } from '../src/config/types';

export const mockClaims: { [key: string]: Set<string> } = {
  mockIdentifier: new Set(['alumniOf', 'degree']),
};

export const mockClaimsRequest: ClaimsRequest = {
  query: {
    domain: 'localhost:3333',
    did: 'did:web:localhost%3A5000:.well-known:4e9ec8b9-7a50-4c43-b927-cd85ea4a8d8b',
    claims: {
      id: 'Atlassian',
      input_descriptors: [
        {
          id: 'Alumni Credential',
          format: {
            ldp_vc: {
              proof_type: ['DataIntegrityProof'],
            },
          },
          constraints: {
            fields: [
              {
                path: ['$.type'],
                filter: {
                  type: 'array',
                  pattern: 'AlumniCredential',
                },
              },
              {
                path: ['$.credentialSubject.alumniOf'],
              },
            ],
          },
        },
      ],
    },
    url: 'http://localhost:3333/presentation/verify',
  },
};
