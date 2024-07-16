#!/usr/bin/env ts-node

import { Command } from 'commander';
import generateKeyPair from '../../../lib/src/key.js';
import { saveData } from '../../../lib/src/data.js';
import path from 'path';
import config from './cli.config.json' assert { type: 'json' };
import uploadDIDDocument from '../../../lib/src/generate-did.js';
import { verify } from '../../../lib/src/service-provider/verification.js';
import fs from 'fs';

const rootDir = path.resolve(config.rootDir);
const issuerDir = path.resolve(config.issuerDir);

const program = new Command();
const didURL = path.join(rootDir, 'did.txt');
const keyPairURL = path.join(rootDir, 'keyPair.key');

program.name('identity-owner').description('John Smith').version('1.0.0');


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
  .command('create-presentation <credential>')
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

program.parse(process.argv);
