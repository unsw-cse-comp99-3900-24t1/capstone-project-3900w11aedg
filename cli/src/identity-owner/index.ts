import { Command } from 'commander';
import fs from 'fs';
import { deriveAndCreatePresentation } from '../../../lib/src/backend/presentations.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjectRoot } from '../../../lib/src/find.js';
import config from './cli.config.json' assert { type: 'json' };
import generateKeyPair from '../../../lib/src/key.js';
import uploadDIDDocument from '../../../lib/src/generate-did.js';
import { saveData } from '../../../lib/src/data.js';
import { DIDDocument } from 'did-resolver';

const rootDir = path.resolve(config.rootDir);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __basedir = getProjectRoot(__dirname);
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
  .command('create-presentation <credentials> [selectedClaims]')
  .description('Create a presentation with required credentials and optional selectedClaims, in format: verify-presentation credential1,credential2 claim1,claim2')
  .action(async (credentials: string, selectedClaims?) => {
    const credentialsList = credentials.split(',');
    const selectedClaimsList = selectedClaims ? selectedClaims.split(',') : null;

    try {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const signedCredentials: any[] = credentialsList.map((credential) => JSON.parse(fs.readFileSync(
        __basedir + '/signed-credentials/signed-' + credential + '.json',
        'utf8')));
      const presentation = await deriveAndCreatePresentation(signedCredentials, selectedClaimsList);

      const path = __basedir + '/presentations';
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      fs.writeFileSync(
        path + `/${presentation.id}.json`,
        JSON.stringify(presentation, null, 2),
      );
      console.log('Presentation with id ' + presentation.id + ' created.');
      console.log(presentation);
      console.log('Credentials in the presentation:');
      console.log(presentation.verifiableCredential);
    } catch (err) {
      console.log(`The presentation was not created, due to ${err}`);
    }
  });

// program
//   .command('sign-presentation <presentation> <challenge>')
//   .description('Sign a presentation with an associated challenge')
//   .action(async (presentation: string, challenge: string) => {
//     try {
//       const presentationPath = __basedir + '/presentations/' + presentation + '.json';
//       if (!fs.existsSync(presentationPath)) {
//         console.log('Presentation does not exist');
//         return;
//       }
//       const presentationData = JSON.parse(fs.readFileSync(presentationPath, 'utf8'));
//       const { keyPair } = await loadData(didURL, keyPairURL);
//       const signedPresentation = await signPresentation(presentationData, keyPair, challenge);
//
//       const path = __basedir + `/signed-presentations`;
//       if (!fs.existsSync(path)) {
//         fs.mkdirSync(path, { recursive: true });
//       }
//       fs.writeFileSync(
//         __basedir + '/signed-presentations/signed-' + presentation + '.json',
//         JSON.stringify(signedPresentation, null, 2),
//       );
//       console.log('Presentation signed and saved as signed-' + presentation + '.json');
//     } catch (err) {
//       console.log(`The presentation was not signed, due to ${err}`);
//     }
//   });

program.parse(process.argv);