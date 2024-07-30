import React from 'react';
import { Text, View } from 'react-native';
import { normaliseKey } from '../helper/normalise';

interface HistoryDropdownProps {
  claims: [string: string][];
}

const HistoryDropdown: React.FC<HistoryDropdownProps> = ({ claims }) => {
  let key = 1;
  return (
    <View className="relative flex-col p-3 justify-end bg-gray-800 rounded-lg">
      <Text className="text-white text-lg">Claims presented:</Text>
      {claims.map((claim) => (
        (key += 1),
        <View key={key}>
          <Text className="text-white text-base">
            <Text className="font-bold">{normaliseKey(claim[0])}</Text>
            - {claim[1]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default HistoryDropdown;
