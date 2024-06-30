declare module '@digitalbazaar/data-integrity' {
  export class DataIntegrityProof {
    verificationMethod?: string;

    constructor(options?: {
      signer: string;
      date?: null | string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cryptosuite: any;
      legacyContext?: boolean;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ensureSuiteContext(options: { document: any; addSuiteContext: boolean }): void;
  }
}
