#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
import generateDID from '../../../lib/src/generate-did.js';
import { saveData } from '../../../lib/src/data.js';
import { fileURLToPath } from 'url';
import path from 'path';

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyPairURL = path.join(__dirname, 'keyPair.key');
const didURL = path.join(__dirname, 'did.txt');

program.name('service-provider').description('NSW Ivy Nightclub CLI').version('1.0.0');

program
  .command('verify <did>')
  .description('Verify a user')
  .action((did: string) => {
    console.log(`Verifying ${did}!`);
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
