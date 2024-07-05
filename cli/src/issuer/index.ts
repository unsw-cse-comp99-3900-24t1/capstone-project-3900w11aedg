#!/usr/bin/env ts-node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import generateKeyPair from '../../../lib/src/key.js';
import { credentialToQRCode, saveQRCode, signCredential } from '../../../lib/src/issuer/signing.js';

const program = new Command();
const privateKeyPath = path.join(__dirname, 'private.key');

const loadKeyPair = (): string => {
  if (!fs.existsSync(privateKeyPath)) {
    console.error('Private key not found');
    process.exit(1);
  }
  return fs.readFileSync(privateKeyPath, 'utf8');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveKeyPair = (keyPair: any) => {
  fs.writeFileSync(privateKeyPath, JSON.stringify(keyPair));
};

program.name('issuer').description('NSW Government Credential Issuance Tool').version('1.0.0');

program
  .command('sign <credential>')
  .description('Signs a credential')
  .action((credential: string) => {
    const keyPair = loadKeyPair();
    // Read from credentials directory -- get credential JSON at given credential URL
    const credentialJSON = fs.readFileSync(__dirname + '/credentials' + credential, 'utf8');
    const signedCredential = signCredential(credentialJSON, keyPair);
    console.log(`Signed credential: ${signedCredential}`);
    credentialToQRCode(signedCredential).then(async (qrCode) => {
      await saveQRCode(qrCode, credential + '.png');
    });

    console.log(`Credential signed and saved as ${credential}.png`);
  });

program
  .command('create-key-pair')
  .description('Creates a new key pair')
  .action(() => {
    const keyPair = generateKeyPair();
    saveKeyPair(keyPair);
    console.log('Key pair created');
  });

program.parse(process.argv);
