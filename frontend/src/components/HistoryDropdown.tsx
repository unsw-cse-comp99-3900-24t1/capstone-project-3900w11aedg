import React from 'react';
import { Text, View } from 'react-native';
import { Claims } from "../config/types";

interface HistoryDropdownProps {
  claims: Claims;
}

const HistoryDropdown: React.FC<HistoryDropdownProps> = () => {
  return (
    <View className="relative flex-col p-3 justify-end bg-gray-800 rounded-lg">
      <Text className="text-white text-lg">Claims presented:</Text>
      <Text className="text-white text-base">
        <Text className="font-bold">Degree </Text>
        - Bachelor of Computer Science
      </Text>
      <Text className="text-white text-base">
        <Text className="font-bold">Alumni </Text>
        - UNSW
      </Text>
    </View>
  );
};

export default HistoryDropdown;