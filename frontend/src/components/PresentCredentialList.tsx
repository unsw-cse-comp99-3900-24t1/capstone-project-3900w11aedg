import { View, Text } from 'react-native';
import React from 'react';
import * as Keychain from 'react-native-keychain';
import { JSONPath } from 'jsonpath-plus';
import { ClaimsRequest, Field } from '../../../lib/types/ClaimsRequest';
import { VerifiableCredential } from '../../../lib/types/credentials';

type Props = {
  claimsRequest: ClaimsRequest;
};

// Different claim queries have different places to post to
function PresentCredentialList({ claimsRequest }: Props): JSX.Element {
  const [validCredentials, setValidCredentials] = React.useState<VerifiableCredential[]>([]);
  const [requiredFields, setRequiredFields] = React.useState<Field[]>([]);

  const getFields = async () => {
    const fields: Field[] = [];
    claimsRequest.query.map((queryItem) =>
      queryItem.claims.input_descriptors.map((inputDescriptor) =>
        inputDescriptor.constraints.fields.map((field) => {
          fields.push(field);
        })
      )
    );
    setRequiredFields(fields);
  };

  // Gets all stored credentials
  const getCredentials = async () => {
    try {
      const keys = await Keychain.getAllGenericPasswordServices();
      const credentials: VerifiableCredential[] = [];
      keys.map(async (key) => {
        const credential = await Keychain.getGenericPassword({ service: key });
        if (credential) {
          const credentialsData = JSON.parse(credential.password);
          credentials.push(credentialsData);
        }
      });
      setValidCredentials(credentials);
    } catch (error) {
      console.log(error);
    }
  };

  //gpt
  const filterCredentials = async () => {
    await getFields();
    await getCredentials();
    return validCredentials.filter((credential) => {
      return requiredFields.every((field) => {
        const results = JSONPath({ path: field.path[0]!, json: credential });
        if (!results.length) {
          return false;
        }
        if (field.filter) {
          const { pattern } = field.filter;
          return results.some((result) => {
            if (Array.isArray(result)) {
              return result.some((item) => new RegExp(pattern).test(item));
            }
            return new RegExp(pattern).test(result);
          });
        }
        return true;
      });
    });
  };

  React.useEffect(() => {
    filterCredentials();
  });

  return (
    <View>
      <Text>PresentCredentialList</Text>
    </View>
  );
}

export default PresentCredentialList;
