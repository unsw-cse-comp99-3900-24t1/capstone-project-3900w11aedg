#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
// import generateDID from '../../../lib/src/generate-did.js';
import { saveData } from '../../../lib/src/data.js';
import { saveQRCode, urlToQRCode } from '../../../lib/src/qr.js';
import path from 'path';
import config from './cli.config.json' assert { type: 'json' };
import uploadDIDDocument from '../../../lib/src/generate-did.js';
import { verifyClaim } from '../../../lib/src/service-provider/claim-verify-helper.js';
import fs from 'fs';

const rootDir = path.resolve(config.rootDir);
const backendUrl = path.resolve(config.backendRoute);
const issuerDir = path.resolve(config.issuerDir);

const program = new Command();
const didURL = path.join(rootDir, 'did.txt');
const keyPairURL = path.join(rootDir, 'keyPair.key');

program.name('service-provider').description('NSW Ivy Nightclub CLI').version('1.0.0');

program
  .command('verify <did>')
  .description('Verify a user')
  .action((did: string) => {
    console.log(`Verifying ${did}!`);
  });

program
  .command('qr-code')
  .description('Create a QR Code')
  .action(async () => {
    try {
      const qr = await urlToQRCode(backendUrl);
      await saveQRCode(qr, rootDir + '/qr-code.png');
      console.log();
    } catch (err) {
      console.error('Error creating QR code', err);
    }
  });

program
  .command('create-key-pair')
  .description('Creates a new key pair')
  .action(async () => {
    try {
      const { keyPair, did, didDocument } = await generateKeyPair();
      await uploadDIDDocument(didDocument, did);
      saveData(didURL, keyPairURL, keyPair, did);
      console.log(`Key pair created.`);
      console.log(`Your DID: ${did}`);
    } catch (err) {
      console.error('Error creating key pair', err);
    }
  });

program
  .command('verify-credential <credential>')  
  .description('Verify a credential')
  .action(async (credential: object) => {
    const signedCredential = fs.readFileSync(
      issuerDir + '/signed-credentials/signed-' + credential + '.json',
      'utf8'
    );
    try {
      await verifyClaim(JSON.parse(signedCredential));
      console.log('The credential is verified.');
    } catch (err) {
      console.log(`The credential is not verified, due to ${err}`);
    }
  });

program.parse(process.argv);
