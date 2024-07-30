import { View } from 'react-native';
import React from 'react';
import * as Keychain from 'react-native-keychain';
import { JSONPath } from 'jsonpath-plus';
import { Card, ClaimsRequest, Field, VerifiableCredential } from '../config/types';
import PresentCredential from './PresentCredential';
import normaliseCredential from '../helper/normalise';

type Props = {
  claimsRequest: ClaimsRequest;
  chosenCredentials: VerifiableCredential[];
  chooseCredential: (credentialsRequest: VerifiableCredential) => void;
  addClaims: (claim: string, isAdding: boolean, id: string) => void;
  claimsObject: { [key: string]: Set<string> };
};

type CredentialTuple = [Card, VerifiableCredential];

function PresentCredentialList({
  claimsRequest,
  chosenCredentials,
  chooseCredential,
  addClaims,
  claimsObject,
}: Props): JSX.Element {
  const [credentials, setCredentials] = React.useState<CredentialTuple[]>([]);

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
            delete JSONCredential.pinned;
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
              return [normaliseCredential(key, credential.password), JSONCredential];
            }
          }
          return null;
        });
        const validCredentials = await Promise.all(credentialPromises);
        setCredentials(validCredentials.filter(Boolean) as CredentialTuple[]);
      } catch (error) {
        console.log(error);
      }
    };
    getCredentials();
  }, [claimsRequest.query]);

  return (
    <View>
      {credentials.map((credential, index) => (
        <PresentCredential
          claimsObject={claimsObject}
          key={index}
          credential={credential[0]}
          verifiableCredential={credential[1]}
          chosenCredentials={chosenCredentials}
          chooseCredential={chooseCredential}
          addClaims={addClaims}
        />
      ))}
    </View>
  );
}

export default PresentCredentialList;
