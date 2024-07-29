import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import { ClaimsRequest } from '../../../lib/types/ClaimsRequest';
import PresentCredentialList from '../components/PresentCredentialList';

type Props = {
  claimsRequest: ClaimsRequest;
};

// change to PresentDetails, keep list of claims here. Have cred list as component, button as component

function PresentDetails({ claimsRequest }: Props): JSX.Element {
  return (
    <View>
      <ScrollView className="px-[5%] mt-[15px]">
        <Text className="text-black dark:text-white text-lg">
          The Service Provider is requesting to verify your:
        </Text>
        {claimsRequest.query.map((queryItem) =>
          queryItem.claims.input_descriptors.map((inputDescriptor) => (
            <Text
              className="text-black dark:text-white ml-[5px] text-lg"
              key={`${queryItem.claims.id}-${inputDescriptor.id}`}
            >
              {`\u2022 ${inputDescriptor.id}`}
            </Text>
          ))
        )}
        <PresentCredentialList claimsRequest={claimsRequest} />
      </ScrollView>
      {/*buttons here */}
    </View>
  );
}

export default PresentDetails;
