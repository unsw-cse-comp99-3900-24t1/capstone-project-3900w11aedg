#!/usr/bin/env ts-node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { loadData, saveData } from '../../../lib/src/data.js';
import generateKeyPair from '../../../lib/src/key.js';
import generateDID from '../../../lib/src/generate-did.js';
import { signCredential } from '../../../lib/src/issuer/signing.js';
import config from './cli.config.json' assert { type: 'json' };
import { saveQRCode, urlToQRCode } from '../../../lib/src/qr.js';

const rootDir = path.resolve(config.rootDir);
const backendUrl = path.resolve(config.backendRoute);

const program = new Command();
const didURL = path.join(rootDir, 'did.txt');
const keyPairURL = path.join(rootDir, 'keyPair.key');

program.name('issuer').description('UNSW Credential Issuance Tool').version('1.0.0');

program
  .command('sign <credential>')
  .description('Signs a credential')
  .action(async (credential: string) => {
    const { did, keyPair } = await loadData(didURL, keyPairURL);
    console.log(keyPair);
    const credentialRead = fs.readFileSync(
      rootDir + '/credentials/' + credential + '.json',
      'utf8'
    );
    const credentialJSON = JSON.parse(credentialRead);
    credentialJSON.issuer = did;
    const signedCredential = await signCredential(credentialJSON, keyPair);
    const path = rootDir + `/signed-credentials`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    fs.writeFileSync(
      path + `/signed-${credential}.json`,
      JSON.stringify(signedCredential, null, 2)
    );
    console.log(`Signed credential: ${JSON.stringify(signedCredential, null, 2)}`);
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
      await generateDID(didDocument, did);
      saveData(didURL, keyPairURL, keyPair, did);
      console.log(`Key pair created.`);
      console.log(`Your DID: ${did}`);
    } catch (err) {
      console.error('Error creating key pair', err);
    }
  });

program.parse(process.argv);
