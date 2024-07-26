#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
import { saveData } from '../../../lib/src/data.js';
import { saveQRCode } from '../../../lib/src/qr.js';
import QRCode from 'qrcode';
import path from 'path';
import config from './cli.config.json' assert { type: 'json' };
import uploadDIDDocument from '../../../lib/src/generate-did.js';
import { verifyDocument } from '../../../lib/src/service-provider/verification.js';
import fs from 'fs';
import { generateQRCodeUrl } from '../../../lib/src/service-provider/request-claims.js';
import { fileURLToPath } from 'url';
import { getProjectRoot } from '../../../lib/src/find.js';
import { deriveCredential } from '../../../lib/src/backend/presentations.js';
import { DIDDocument } from 'did-resolver';

const rootDir = path.resolve(config.rootDir);
const backendRoute = config.backendRoute;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __basedir = getProjectRoot(__dirname);

const program = new Command();
const didURL = path.join(rootDir, 'did.txt');
const keyPairURL = path.join(rootDir, 'keyPair.key');

program.name('service-provider').description('NSW Ivy Nightclub CLI').version('1.0.0');

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
      const qr = await QRCode.toDataURL(url);
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
      await uploadDIDDocument(didDocument as DIDDocument, did);
      saveData(didURL, keyPairURL, keyPair, did);
      console.log(keyPair);
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
      __basedir + '/signed-credentials/signed-' + credential + '.json',
      'utf8',
    );
    try {
      const derivedCredential = await deriveCredential(JSON.parse(signedCredential));
      if (!derivedCredential) {
        throw new Error('Error deriving the credential.');
      }

      const results = await verifyDocument(derivedCredential);
      if (results.verified) {
        console.log('The credential is verified.');
      } else {
        console.log('The credential is not verified.');
      }
    } catch (err) {
      console.log(`The credential is not verified, due to ${err}`);
    }
  });

program
  .command('verify-presentation <presentationId>')
  .description('Verify a presentation with required credentials and optional selectedClaims, in format: verify-presentation credential1,credential2 claim1,claim2')
  .action(async (presentationId: string) => {
    try {
      const presentation = JSON.parse(fs.readFileSync(
        __basedir + '/presentations/' + presentationId + '.json',
        'utf8'));
      const results = await verifyDocument(presentation, true);
      if (results.verified) {
        console.log('The presentation is verified.');
      } else {
        console.log('The presentation is not verified.');
      }
    } catch (err) {
      console.log(`The presentation is not verified, due to ${err}`);
    }
  });

program.parse(process.argv);
