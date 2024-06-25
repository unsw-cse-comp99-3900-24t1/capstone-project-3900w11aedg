export class UnsignedCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: Date;
  credentialSubject: CredentialSubject;

  constructor(
    context: string[],
    type: string[],
    issuer: string,
    issuanceDate: Date,
    credentialSubject: CredentialSubject
  ) {
    this['@context'] = context;
    this.type = type;
    this.issuer = issuer;
    this.issuanceDate = issuanceDate;
    this.credentialSubject = credentialSubject;
  }
}

export class VerifiableCredential {
  // Links to the context of the credential (usually should be
  // "https://www.w3.org/2018/credentials/v1",
  // "https://www.w3.org/2018/credentials/examples/v1"
  '@context': string[];
  credentialSubject: CredentialSubject;
  id: string;
  issuer: string;
  issued: Date | null;
  // What kind of credential it is e.g. Degree or Certificate
  type: string[];
  proof: {
    type: ProofType;
    cryptosuite: CryptoSuite;
    // DID of owner
    creator: string;
    created: Date | null;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
  validFrom: Date | null;
  issuanceDate: Date | null;

  constructor(
    context: string[],
    credentialSubject: CredentialSubject,
    id: string,
    issuer: string,
    type: string[],
    proof: {
      type: ProofType;
      creator: string;
      cryptosuite: CryptoSuite;
      proofPurpose: string;
      created: Date | null;
      verificationMethod: string;
      jws: string;
    }
  ) {
    this['@context'] = context;
    this.credentialSubject = credentialSubject;
    this.id = id;
    this.issuer = issuer;
    this.type = type;
    this.proof = proof;
    this.issued = null;
    this.validFrom = null;
    this.issuanceDate = null;
  }
}

export type CredentialSubject = {
  [key: string]: string;
  // DID of identity owner - omit ID for unlinkability
  id?: string;
};

export enum ProofType {
  'DataIntegrityProof',
}

export enum CredentialFormats {
  'ldp_vc',
  // 'jwt_vc_json',
}

export enum CryptoSuite {
  // 'ecdsa-sd-2023',
  'bbs-2023',
}

export enum SigningAlgorithms {
  // 'Ed25519Signature2018',
  'BbsBlsSignature2020',
}

export enum CryptographicBindingMethods {
  // 'jwk'
  // 'cose_key
  'did:web',
}

export type IssuerMetadata = {
  credential_issuer: string;
  credential_endpoint: string;
  credential_configurations_supported: string[];
};

export class CredentialConfigurations {
  format: CredentialFormats;
  cryptographic_binding_methods_supported: CryptographicBindingMethods[];
  credential_signing_alg_values_supported: SigningAlgorithms[];
  proof_types_supported: {
    ldp_vc: SigningAlgorithms[];
  };

  constructor(
    format: CredentialFormats,
    cryptographic_binding_methods_supported: CryptographicBindingMethods[],
    credential_signing_alg_values_supported: SigningAlgorithms[],
    proof_types_supported: {
      ldp_vc: SigningAlgorithms[];
    }
  ) {
    this.format = format;
    this.cryptographic_binding_methods_supported = cryptographic_binding_methods_supported;
    this.credential_signing_alg_values_supported = credential_signing_alg_values_supported;
    this.proof_types_supported = proof_types_supported;
  }
}
