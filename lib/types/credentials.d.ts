export type UnsignedCredential = {
  '@context': string[] | string;
  type: string[] | string;
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    [key: string]: object | string;
  };
};

export type VerifiablePresentation = {
  '@context': string[] | string;
  type: string[] | string;
  verifiableCredential: VerifiableCredential[];
  id: string;
};

export type VerifiableCredential = {
  '@context': string[] | string;
  id?: string;
  type: string[] | string;
  issuer: string;
  validFrom?: string;
  validUntil?: string;
  description?: string;
  name?: string;
  credentialStatus?: {
    id?: string;
    type: string;
    statusPurpose?: string;
    statusListIndex?: string;
    statusListCredential?: string;
  };
  credentialSchema?: {
    id: string;
    type: string;
  }[];
  issuanceDate: string;
  credentialSubject: {
    [key: string]: object | string;
  };
  proof: Proof;
};

export type Proof = {
  type: string;
  verificationMethod: string;
  cryptosuite: string;
  proofPurpose: string;
  proofValue: string;
};
