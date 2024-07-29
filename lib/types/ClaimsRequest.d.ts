export type ClaimsRequest = {
  query: ClaimsQuery[]
};

export type ClaimsQuery = {
  domain: string,
  did: string,
  claims: Claims,
  url: string
};

export type Claims = {
  id: string,
  input_descriptors: InputDescriptor[]
};

export type InputDescriptor = {
  id: string,
  format?: {
    ldp_vc: {
      proof_type: string[]
    }
  },
  constraints: {
    fields: Field[]
  }
};

export type Field = {
  path: string[],
  filter?: {
    type: string,
    pattern: string
  }
};