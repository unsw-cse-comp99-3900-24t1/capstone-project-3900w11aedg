import { VerifiableCredential } from '../src/config/types';

export const mockCredential: VerifiableCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.w3.org/2018/credentials/examples/v1',
    'https://w3id.org/security/data-integrity/v2',
  ],
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer: 'did:web:localhost%3A5000:.well-known:a262ca75-2881-4980-8cc6-46b2ab9f49aa',
  issuanceDate: '2024-07-15T13:07:33Z',
  credentialSubject: {
    alumniOf: 'University of New South Wales',
    degree: 'Bachelor of Computer Science (Honours)',
  },
  proof: {
    type: 'DataIntegrityProof',
    verificationMethod:
      'did:web:localhost%3A5000:.well-known:a262ca75-2881-4980-8cc6-46b2ab9f49aa#zUC761TbTD9uq6L9SGJi2hhMraU81JwZmmFBaSeisWGPTAB5u4gbcsvZGMscGhBJBGC8v3JrRxx2P65efLAARngrotceu34qULiPrBFwBkmpARpbCBmYjQLPaXtgQX5dX974qjr',
    cryptosuite: 'bbs-2023',
    proofPurpose: 'assertionMethod',
    proofValue:
      'u2V0ChVhQlL80_QOu20hNsLGyBFtq6OZFXb9woFyFyQ3CD9fUiRJez3pUyL-Tf35wunOb8pQBCbBnstWEGGLrVa-kmuGPMc-wTaMyFlK--XwqYttzogtYQCgsTaY0tsEOv8xCtGYX4BktJGxEJLoF54EXhYym3p0cKbgStwKQgQV8XOcIfx80WK7q8YpTinyVbMbuxnskyjxYYI69z7jeXZb1bsoHv2a60GX-WSHCQ5q67_cyNjo5Ru-sKlHitsZTa7iM27HjwxE0CA8eFWSEYC4b8lykA81ettkT2pamEDbrGdGTrIUn1eYizWNGU1GbOHXrBaGBCxhzzVggZcrau9OU7JltfF2YDTSMARLmSC2iqcOpTukNVyF0GSiCbS9pc3N1YW5jZURhdGVnL2lzc3Vlcg',
  },
};

export const mockStoredCredentials: { key: string; password: string }[] = [
  {
    key: '1',
    password: JSON.stringify({
      name: "Bachelor's Degree",
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
        'https://w3id.org/security/data-integrity/v2',
      ],
      type: ['VerifiableCredential', 'AlumniCredential'],
      issuer: 'did:web:example.com',
      issuanceDate: '2024-07-15T13:07:33Z',
      credentialSubject: {
        alumniOf: 'University of New South Wales',
        degree: 'Bachelor of Computer Science (Honours)',
      },
      proof: {
        type: 'DataIntegrityProof',
        verificationMethod: 'did:web:example.com#public-key',
        cryptosuite: 'bbs-2023',
        proofPurpose: 'assertionMethod',
        proofValue: 'u2V0ChVhQlL80',
      },
    }),
  },
  {
    key: '2',
    password: JSON.stringify({
      name: "Master's Degree",
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
        'https://w3id.org/security/data-integrity/v2',
      ],
      type: ['VerifiableCredential', 'AlumniCredential'],
      issuer: 'did:web:example.com',
      issuanceDate: '2024-07-15T13:07:33Z',
      expirationDate: '2024-07-31T13:07:33Z',
      credentialSubject: {
        alumniOf: 'University of New South Wales',
        degree: 'Master of Computer Science',
      },
      proof: {
        type: 'DataIntegrityProof',
        verificationMethod: 'did:web:example.com#public-key',
        cryptosuite: 'bbs-2023',
        proofPurpose: 'assertionMethod',
        proofValue: 'u2V0ChVhQlL80',
      },
    }),
  },
  {
    key: '3',
    password: JSON.stringify({
      name: 'Personal Trainer Certificate',
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/data-integrity/v2',
      ],
      type: ['VerifiableCredential'],
      issuer: 'did:web:example.com',
      issuanceDate: '2024-07-15T13:07:33Z',
      credentialSubject: {
        certification: 'Certificate IV in Fitness',
      },
      proof: {
        type: 'DataIntegrityProof',
        verificationMethod: 'did:web:example.com#public-key',
        cryptosuite: 'bbs-2023',
        proofPurpose: 'assertionMethod',
        proofValue: 'u2V0ChVhQlL80',
      },
    }),
  },
];
