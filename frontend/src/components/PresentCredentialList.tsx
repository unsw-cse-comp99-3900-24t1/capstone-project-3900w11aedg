import { View } from 'react-native';
import React from 'react';
import * as Keychain from 'react-native-keychain';
import { JSONPath } from 'jsonpath-plus';
import { Card, ClaimsRequest, Field } from '../config/types';
import PresentCredential from './PresentCredential';
import normaliseCredential from '../helper/normalise';

type Props = {
  claimsRequest: ClaimsRequest;
};

// Different claim queries have different places to post to
function PresentCredentialList({ claimsRequest }: Props): JSX.Element {
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
        const credentialPromises = keys.map(async (key, index) => {
          const credential = await Keychain.getGenericPassword({ service: key });
          if (credential) {
            const JSONCredential = JSON.parse(credential.password);
            const isValidCredential = requiredFields.every((field) => {
              const results = JSONPath({ path: field.path[0]!, json: JSONCredential });
              if (!results.length) {
                return false;
              }
              if (field.filter) {
                const { pattern } = field.filter;
                return results.some((result) => {
                  if (Array.isArray(result)) {
                    return result.some((item) => new RegExp(pattern).test(String(item)));
                  }
                  return new RegExp(pattern).test(String(result));
                });
              }
              return true;
            });

            if (isValidCredential) {
              return normaliseCredential(index, key, credential.password);
            }
          }
          return null;
        });
        const validCredentials = await Promise.all(credentialPromises);
        setCredentials(validCredentials.filter(Boolean) as Card[]);
      } catch (error) {
        console.log(error);
      }
    };
    getCredentials();
  }, [claimsRequest.query]);

  return (
    <View>
      {credentials.map((credential, index) => (
        <PresentCredential key={index} credential={credential} />
      ))}
    </View>
  );
}

export default PresentCredentialList;
