#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
import generateDID from '../../../lib/src/generate-did.js';
import { saveData } from '../../../lib/src/data.js';
import { saveQRCode, urlToQRCode } from '../../../lib/src/qr.js';
import path from 'path';
import config from './cli.config.json' assert { type: 'json' };

const rootDir = path.resolve(config.rootDir);

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
  .command('qr-code <url>')
  .description('Create a QR Code')
  .action(async (url: string) => {
    try {
      const qr = await urlToQRCode(url);
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
      const keyPair = await generateKeyPair({ id: 'https://www.unsw.edu.au/' });
      const publicKey = keyPair.publicKey.toString();
      const did = await generateDID(publicKey);
      saveData(didURL, keyPairURL, keyPair, did.id);
      console.log(`Key pair created.`);
      console.log(`Your DID: ${did.id}`);
    } catch (err) {
      console.error('Error creating key pair', err);
    }
  });
program.parse(process.argv);
