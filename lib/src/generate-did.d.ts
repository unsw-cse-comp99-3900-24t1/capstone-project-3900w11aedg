import { DIDDocument } from 'did-resolver';
declare function generateDID(publicKey: string): Promise<DIDDocument>;
export default generateDID;
