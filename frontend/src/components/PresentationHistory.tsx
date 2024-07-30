import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { VerifiablePresentation } from '../config/types';
import HistoryDropdown from "./HistoryDropdown";

interface PresentationHistoryProps {
  presentation: VerifiablePresentation;
}

const PresentationHistory: React.FC<PresentationHistoryProps> = ({ presentation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const source = dropdownVisible
    ? require('../assets/upwards_arrow.png')
    : require('../assets/downwards_arrow.png');

  return (
    <View className="relative justify-end">
      <View className="p-1">
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white text-xl font-bold">Atlassian</Text>
            <Text className="text-white text-xl">replace</Text>
          </View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-400 text-base">30/07/2024</Text>
            <Image
              source={source}
              resizeMode="contain"
              className="h-[13px] w-[13px]"
              tintColor='grey'
            />
          </View>
        </TouchableOpacity>
      </View>
      <View className="pb-2">
        {dropdownVisible && <HistoryDropdown/>}
      </View>
    </View>
  );
};

export default PresentationHistory;