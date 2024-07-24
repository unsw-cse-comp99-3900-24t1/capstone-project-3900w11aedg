export type KeyPair = {
  secretKey: Uint8Array;
  publicKey: Uint8Array;
  curve: string;
  algorithm: string;
  publicKeyMultibase: string;
  secretKeyMultibase: string;
  export: () => Promise<never>;
  signer: () => never;
  deriveProof: () => Promise<never>;
  verifier: () => never;
  id: string;
  controller: string;
};