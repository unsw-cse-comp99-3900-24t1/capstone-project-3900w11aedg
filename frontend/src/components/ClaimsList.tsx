import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { ClaimsRequest } from '../../../lib/types/ClaimsRequest';

type Props = {
  claimsRequest: ClaimsRequest;
};

function PresentCredentialList({ claimsRequest }: Props): JSX.Element {
  console.log(claimsRequest.query[0]?.claims);
  // When press share, check all necessary claims are there, send to each valid url

  return (
    <ScrollView className="px-[5%] mt-[15px]">
      <Text className="text-black dark:text-white text-lg">
        The Service Provider is requesting to verify your:
      </Text>
      {claimsRequest.query.map((queryItem) => (
        <Text key={queryItem.claims.id}>{queryItem.claims.id}</Text>
      ))}
    </ScrollView>
  );
}

export default PresentCredentialList;
