export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: undefined;
  Present: { requestData?: string };
  Issue: { credentialOffers?: keyof { [key: string]: CredentialOffer } };
};

export type CredentialOffer = {
  authorisation_endpoint: string; // Move into authorization servers?
  credential_issuer: string;
  authorization_servers?: string[];
  credentialEndpoint: string;
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
  // Our one uses, currently just an object, should be an array of one object
  display?: {
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  }[];
  credential_configurations_supported: {
    [credential_id: string]: {
      format: string;
      scope?: string;
      cryptographic_binding_methods_supported?: string[];
      credential_signing_alg_values_supported?: string[];
      proof_types_supported?: {
        [proof_type_id: string]: {
          proof_signing_alg_values_supported: string[];
        };
      };
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
  };
};
