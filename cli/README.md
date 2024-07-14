# CLIs Basic Usage

**Configuring the issuer and service provider CLIs**  
Each CLI contains a configuration file `cli.config.json`, which contains the root directory of the issuer/service
provider agent and its backend route. Change these values to match the actual location of the
issuer/service provider agent and its backend route.

```json
{
  "rootDir": "../service-provider/src",
  "issuerDir": "../issuer/src",
  "backendRoute": "localhost:3333"
}
```

**Creating a key pair and uploading a DID Document to the DID Web Server**

Note: The DID Web Server must be running before running this command.

```bash
cd ../did
npm run build && npm start # or npm run dev
cd ../cli

# For issuer
npm run build && npm run start-issuer create-key-pair # or npm run start-issuer-dev create-key-pair

# For service provider
npm run build && npm run start-service-provider create-key-pair # or npm run start-service-provider-dev create-key-pair

# Example output
# Key pair created.
# Your DID: did:web:localhost%3A5000:.well-known:37e54052-0a5e-4321-839c-ee95e9819eef
```

The DID document can be found in `/did/.well-known/${did}/did.json`.

**Creating a QR code for issuer metadata (for identity owner credential requests)**

```bash
# For issuer
npm run start-issuer create-qr-code # or npm run start-issuer-dev create-qr-code

# Example output
# QR code created at: /issuer/src/qr-code.png
```

**Creating a QR code for service provider credential presentation requests**

Note: The service-provider must have a file inside their root directory called `/src/requests/claims-data.json` that
contains their claims in JSON format.  
The claims must also
follow [OpenID4VCP](https://openid.github.io/OpenID4VP/openid-4-verifiable-presentations-wg-draft.html) standards.

```bash
npm run start-service-provider create-qr-code # or npm run start-service-provider-dev create-qr-code

# Example output
# QR code created at: /service-provider/src/qr-code.png
```

All other commands in the CLI are purely for demonstrative and testing purposes and are not necessary for the workflow
of Verifiable Credentials.