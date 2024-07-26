export type VerifiablePresentation = {
  '@context': [string] | string,
  type: [string] | string,
  verifiableCredential: [VerifiableCredential],
  id: string
}

export type VerifiableCredential = {
  '@context': [string] | string,
  type: [string] | string,
  issuer: string,
  issuanceDate: string,
  credentialSubject: {
    [key: string]: object | string;
  },
  proof: Proof
}

export type Proof = {
  type: string,
  verificationMethod: string,
  cryptosuite: string,
  proofPurpose: string,
  proofValue: string
}