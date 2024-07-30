import { View } from 'react-native';
import React from 'react';
import * as Keychain from 'react-native-keychain';
import { JSONPath } from 'jsonpath-plus';
import { Card, ClaimsRequest, Field, VerifiableCredential } from '../config/types';
import PresentCredential from './PresentCredential';
import normaliseCredential from '../helper/normalise';

type Props = {
  claimsRequest: ClaimsRequest;
  setCredentialsRequest: (credentialsRequest: VerifiableCredential[]) => void;
  addClaims: (claim: string, isAdding: boolean, id: string) => void;
};

// Different claim queries have different places to post to
function PresentCredentialList({
  claimsRequest,
  setCredentialsRequest,
  addClaims,
}: Props): JSX.Element {
  const [credentials, setCredentials] = React.useState<Card[]>([]);

  React.useEffect(() => {
    const getCredentials = async () => {
      const requiredFields: Field[] = [];
      claimsRequest.query.claims.input_descriptors.map((inputDescriptor) =>
        inputDescriptor.constraints.fields.map((field) => {
          requiredFields.push(field);
        })
      );
      if (!requiredFields.length) {
        return;
      }

      try {
        const keys = await Keychain.getAllGenericPasswordServices();
        const credentialPromises = keys.map(async (key) => {
          const credential = await Keychain.getGenericPassword({ service: key });
          if (credential) {
            const JSONCredential: VerifiableCredential & { identifier: string } = JSON.parse(
              credential.password
            );
            const isValidCredential = requiredFields.every((field) => {
              const results = JSONPath({ path: field.path[0]!, json: JSONCredential });
              if (!results.length) {
                return false;
              }
              if (field.filter) {
                const { pattern } = field.filter;
                return results.some((result: string) => {
                  if (Array.isArray(result)) {
                    return result.some((item) => new RegExp(pattern).test(String(item)));
                  }
                  return new RegExp(pattern).test(String(result));
                });
              }
              return true;
            });

            if (isValidCredential) {
              const normalised = normaliseCredential(key, credential.password);
              JSONCredential.identifier = normalised.id;
              return {
                verifiableCredential: JSONCredential,
                cardCredential: normalised,
              };
            }
          }
          return null;
        });
        const validCredentials = await Promise.all(credentialPromises);
        const offset = 10 * 60 * 60 * 1000;
        setCredentials(
          validCredentials.map((cred) => cred?.cardCredential).filter(Boolean) as Card[]
        );
        setCredentialsRequest(
          validCredentials
            .filter(
              (cred) =>
                new Date(cred?.cardCredential.expiryDate as string) >
                new Date(new Date().getTime() + offset)
            )
            .map((cred) => cred?.verifiableCredential)
            .filter(Boolean) as VerifiableCredential[]
        );
      } catch (error) {
        console.log(error);
      }
    };
    getCredentials();
  }, [claimsRequest.query, setCredentialsRequest]);

  return (
    <View>
      {credentials.map((credential, index) => (
        <PresentCredential key={index} credential={credential} addClaims={addClaims} />
      ))}
    </View>
  );
}

export default PresentCredentialList;
