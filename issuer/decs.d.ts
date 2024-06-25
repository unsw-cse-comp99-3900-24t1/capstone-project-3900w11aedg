declare module "@digitalbazaar/vc" {
    import { UnsignedCredential } from "../libraries/src/credential-class";

    interface IssueOptions {
        credential: UnsignedCredential;
        suite: any;
        purpose?: any;
        documentLoader?: any;
        now?: Date | string;
    }

    export function issue(options: IssueOptions): Promise<any>;
}

declare module "@digitalbazaar/data-integrity" {
    export class DataIntegrityProof {
        constructor(options?: {
            signer: string;
            date?: null | string;
            cryptosuite: any;
            legacyContext?: boolean;
        });

        ensureSuiteContext(options: { document: any; addSuiteContext: boolean }): void;

        verificationMethod?: string;
    }
}

declare module "@digitalbazaar/bbs-2023-cryptosuite" {
    export function createSignCryptosuite(options?: { mandatoryPointers?: any[] }): {
        name: string;
        requiredAlgorithm: string;
        createVerifier: () => void;
        createVerifyData: () => void;
        createProofValue: () => void;
        options: { mandatoryPointers: any[] };
    };
}

declare module "@digitalbazaar/bls12-381-multikey" {
    export async function generateBbsKeyPair(options?: {
        id?: string;
        controller?: string;
        algorithm?: string;
        seed?: any;
    }): Promise<any>;
}