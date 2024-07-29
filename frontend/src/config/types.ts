export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: undefined;
  Present: { requestData?: ClaimsRequest };
  Issue: { issuerMetadata?: keyof { [key: string]: IssuerMetadata } };
  View: { card: Card };
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
  '@context': string[] | string;
  id?: string;
  type: string[] | string;
  issuer: string;
  description?: string;
  name?: string;
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
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: {
    [key: string]: object | string;
  };
  proof: Proof;
};

export type Proof = {
  type: string;
  verificationMethod: string;
  cryptosuite: string;
  proofPurpose: string;
  proofValue: string;
};

export type Card = {
  id: number;
  name: string;
  description: string;
  type: string;
  credIssuedBy: string;
  credNumber: string;
  claims: { [key: string]: string };
  issuanceDate: string;
  expiryDate: string;
};

// ClaimsRequest
export type ClaimsRequest = {
  query: ClaimsQuery;
};

export type ClaimsQuery = {
  domain: string;
  did: string;
  claims: Claims;
  url: string;
};

export type Claims = {
  id: string;
  input_descriptors: InputDescriptor[];
};

export type InputDescriptor = {
  id: string;
  format?: {
    ldp_vc: {
      proof_type: string[];
    };
  };
  constraints: {
    fields: Field[];
  };
};

export type Field = {
  path: string[];
  filter?: {
    type: string;
    pattern: string;
  };
};
