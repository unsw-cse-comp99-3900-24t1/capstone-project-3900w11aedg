declare module '@digitalbazaar/vc' {
  interface IssueOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    credential: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    suite: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    purpose?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    documentLoader?: any;
    now?: Date | string;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function issue(options: IssueOptions): Promise<any>;

  export const defaultDocumentLoader;
}
