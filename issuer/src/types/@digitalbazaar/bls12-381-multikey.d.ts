declare module '@digitalbazaar/bls12-381-multikey' {
  export async function generateBbsKeyPair(options?: {
    id?: string;
    controller?: string;
    algorithm?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seed?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any>;
}
