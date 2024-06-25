export class UnsignedCredential {
    '@context': string[];
    type: string[];
    issuer: string;
    issuanceDate: string;
    credentialSubject: CredentialSubject;
    id?: string;
  
    constructor(
      context: string[],
      type: string[],
      issuer: string,
      issuanceDate: string,
      credentialSubject: CredentialSubject,
      id: string
    ) {
      this['@context'] = context;
      this.type = type;
      this.issuer = issuer;
      this.issuanceDate = issuanceDate;
      this.credentialSubject = credentialSubject;
      this.id = id;
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
    // What kind of credential it is e.g. Degree or Certificate
    type: string[];
    proof: {
      type: ProofType;
      created: Date | null;
      proofPurpose: string;
      verificationMethod: string;
      jws: string;
    };
    validFrom: Date | null;
    issuanceDate: string | null;
  
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
      this.validFrom = null;
      this.issuanceDate = null;
    }
  }
  
  export type CredentialSubject = {
    [key: string]: string | { [key: string]: string };
    // DID of identity owner - omit ID for unlinkability
    id?: string;
  };
  
  export enum ProofType {
    'DataIntegrityProof',
  }
  
  export enum CryptoSuite {
    // 'ecdsa-sd-2023',
    // 'bbs-2023',
    'bbs-2020',
  }