import React from 'react';
import { Text, View } from 'react-native';
import { normaliseKey } from '../helper/normalise';

interface HistoryDropdownProps {
  claims: [string, string][];
}

const HistoryDropdown = ({ claims }: HistoryDropdownProps): JSX.Element => {
  return (
    <View
      className="relative flex-col p-3 justify-end bg-gray-800 rounded-lg"
      testID="history-dropdown"
    >
      <Text className="text-white text-lg">Claims presented:</Text>
      {claims.map((claim, index) => (
        <View key={index}>
          <Text className="text-white text-base">
            <Text className="font-bold">{normaliseKey(claim[0])} </Text>- {claim[1]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default HistoryDropdown;
