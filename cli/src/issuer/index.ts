#!/usr/bin/env ts-node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { from } from '@digitalbazaar/bls12-381-multikey';
import generateKeyPair from '../../../lib/src/key.js';
import generateDID from '../../../lib/src/generate-did.js';
import { signCredential } from '../../../lib/src/issuer/signing.js';
import { v4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const program = new Command();
const keyPairPath = path.join(__dirname, 'keyPair.key');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveData = (keyPair: any, did: string) => {
  fs.writeFileSync(path.join(__dirname, 'did.txt'), did);
  fs.writeFileSync(keyPairPath, JSON.stringify(keyPair, null, 2));
};

const loadData = async () => {
  const keyPair = JSON.parse(fs.readFileSync(keyPairPath, 'utf8'));
  keyPair.publicKey = new Uint8Array(Object.values(keyPair.publicKey));
  keyPair.secretKey = new Uint8Array(Object.values(keyPair.secretKey));
  return {
    did: fs.readFileSync(path.join(__dirname, 'did.txt'), 'utf8'),
    keyPair: await from(keyPair),
  };
};

program.name('issuer').description('NSW Government Credential Issuance Tool').version('1.0.0');

program
  .command('sign <credential>')
  .description('Signs a credential')
  .action(async (credential: string) => {
    const { did, keyPair } = await loadData();
    const credentialJSON = fs.readFileSync(__dirname + '/credentials/' + credential, 'utf8');
    const signedCredential = await signCredential(credentialJSON, keyPair, did);
    console.log(`Signed credential: ${JSON.stringify(signedCredential, null, 2)}`);
    // Credential is too big for QR code
    // const qrCode = await credentialToQRCode(signedCredential);
    // saveQRCode(qrCode, credential + '.png')
    //   .then(() => {
    //     console.log(`Credential signed and saved as ${credential}.png`);
    //   })
    //   .catch((err) => {
    //     console.error('Error saving QR code', err);
    //   });
  });

program
  .command('create-key-pair')
  .description('Creates a new key pair')
  .action(async () => {
    try {
      const UUID = v4();
      const did = await generateDID(UUID);
      const keyPair = await generateKeyPair({ id: did });
      saveData(keyPair, did.id);
      console.log(`Key pair created.`);
      console.log(`Your DID: ${did.id}`);
    } catch (err) {
      console.error('Error creating key pair', err);
    }
  });

program.parse(process.argv);
