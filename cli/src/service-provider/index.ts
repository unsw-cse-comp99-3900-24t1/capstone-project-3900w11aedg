#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
import generateDID from '../../../lib/src/generate-did.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyPairPath = path.join(__dirname, 'keyPair.key');

// const loadKeyPair = (): string => {
//   if (!fs.existsSync(keyPairPath)) {
//     console.error('Private key not found');
//     process.exit(1);
//   }
//   return fs.readFileSync(keyPairPath, 'utf8');
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveKeyPair = (keyPair: any) => {
  fs.writeFileSync(keyPairPath, JSON.stringify(keyPair));
};

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
      saveKeyPair(keyPair);
      const did = await generateDID(keyPair.publicKeyMultibase);
      console.log(`Key pair created.`);
      console.log(`Your DID: ${did.id}`);
    } catch (err) {
      console.error('Error creating key pair', err);
    }
  });

program.parse(process.argv);
