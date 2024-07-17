export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: undefined;
  Present: { requestData?: string };
  Issue: { issuerMetadata?: keyof { [key: string]: IssuerMetadata } };
};

export type IssuerMetadata = {
  authorization_endpoint: string; // Move into authorization servers?
  credential_issuer: string;
  authorization_servers?: string[];
  credential_endpoint: string;
  batch_credential_endpoint?: string;
  deferred_credential_endpoint?: string;
  notification_endpoint?: string;
  credential_response_encryption?: {
    alg_values_supported: string[];
    enc_values_supported: string[];
    encryption_required: boolean;
  };
  credential_identifiers_supported?: boolean;
  signed_metadata?: string;
  // Our one uses, currently just an object, should be an array of objects
  display?: {
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  }[];
  credential_configurations_supported: {
    [credential_id: string]: CredentialConfig;
  };
};

export type CredentialConfig = {
  format: string;
  scope?: string;
  cryptographic_binding_methods_supported?: string[];
  credential_signing_alg_values_supported?: string[];
  proof_types_supported?: {
    [proof_type_id: string]: {
      proof_signing_alg_values_supported: string[];
    };
  };
  // An array to account for multiple languages
  display?: {
    name: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
    description?: string;
    background_color?: string;
    background_image?: {
      uri: string;
    };
    text_color?: string;
  }[];
};

export type VerifiableCredential = {
  '@context': string[];
  id?: string;
  type: string[];
  name?: string;
  description?: string;
  issuer: string;
  validFrom?: string;
  validUntil?: string;
  credentialStatus?: {
    id?: string;
    type: string;
    statusPurpose?: string;
    statusListIndex?: string;
    statusListCredential?: string;
  };
  credentialSchema?: {
    id: string;
    type: string;
  }[];
  // sus
  credentialSubject: object;
};
