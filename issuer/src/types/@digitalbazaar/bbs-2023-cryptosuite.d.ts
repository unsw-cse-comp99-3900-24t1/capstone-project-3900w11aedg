declare module '@digitalbazaar/bbs-2023-cryptosuite' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createSignCryptosuite(options?: { mandatoryPointers?: any[] }): {
    name: string;
    requiredAlgorithm: string;
    createVerifier: () => void;
    createVerifyData: () => void;
    createProofValue: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: { mandatoryPointers: any[] };
  };
}
