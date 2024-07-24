export type VerifiablePresentation = {
  '@context': [string],
  type: [string],
  verifiableCredential: [VerifiableCredential],
  id: string
}

export type VerifiableCredential = {
  '@context': [string],
  type: [string],
  issuer: string,
  issuanceDate: string,
  credentialSubject: {
    [key: string]: object;
  },
  proof: Proof
}

export type Proof = {
  type: string,
  verificationMethod: string,
  cryptoSuite: string,
  proofPurpose: string,
  proofValue: string
}