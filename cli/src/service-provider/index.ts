#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
import { saveData } from '../../../lib/src/data.js';
import { saveQRCode, urlToQRCode } from '../../../lib/src/qr.js';
import path from 'path';
import config from './cli.config.json' assert { type: 'json' };
import uploadDIDDocument from '../../../lib/src/generate-did.js';
import { verify } from '../../../lib/src/service-provider/verification.js';
import fs from 'fs';
import { generateQRCodeUrl } from '../../../lib/src/service-provider/claim-request-helper.js';
import { deriveAndCreatePresentation } from '../../../lib/src/backend/presentations.js';

const rootDir = path.resolve(config.rootDir);
const issuerDir = path.resolve(config.issuerDir);
const backendRoute = config.backendRoute;

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
      const claims = fs.readFileSync(
        rootDir + '/claims/claims-data.json',
        'utf8',
      );
      const url = await generateQRCodeUrl(backendRoute, rootDir, JSON.parse(claims), didURL, keyPairURL);
      const qr = await urlToQRCode(url);
      await saveQRCode(qr, rootDir + '/qr-code.png');
      console.log('QR Code generated.');
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
      'utf8',
    );
    try {
      await verify(JSON.parse(signedCredential));
      console.log('The credential is verified.');
    } catch (err) {
      console.log(`The credential is not verified, due to ${err}`);
    }
  });

program
  .command('verify-presentation <credentials> [selectedClaims]')
  .description('Verify a presentation with required credentials and optional selectedClaims, in format: verify-presentation credential1,credential2 claim1,claim2')
  .action(async (credentials: string, selectedClaims: string) => {
    const credentialsList = credentials.split(',');
    const selectedClaimsList = selectedClaims ? selectedClaims.split(',') : null;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signedCredentials: any[] = [];
    credentialsList.map((credential) => {
      const credentialData = fs.readFileSync(
        issuerDir + '/signed-credentials/signed-' + credential + '.json',
        'utf8'
      );
      signedCredentials.push(JSON.parse(credentialData));
    });
    const presentation = selectedClaimsList ? await deriveAndCreatePresentation(signedCredentials, selectedClaimsList)
                                            : await deriveAndCreatePresentation(signedCredentials);
    
    console.log('Derived credentials:');
    console.log(presentation.verifiableCredential);
    
    try {
      await verify(presentation, true);
      console.log('The presentation is verified.');
    } catch (err) {
      console.log(`The presentation is not verified, due to ${err}`);
    }
  });

program.parse(process.argv);
