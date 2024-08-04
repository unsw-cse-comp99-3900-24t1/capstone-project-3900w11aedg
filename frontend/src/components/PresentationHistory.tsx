import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { SuccessfulPresentation } from '../config/types';
import HistoryDropdown from './HistoryDropdown';

type Props = {
  presentation: SuccessfulPresentation;
};

const PresentationHistory = ({ presentation }: Props): JSX.Element => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const source = dropdownVisible
    ? require('../assets/upwards_arrow.png')
    : require('../assets/downwards_arrow.png');

  return (
    <View className="relative justify-end" testID="presentation-history-entry">
      <View className="p-1">
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-white text-xl font-bold">{presentation.serviceProvider}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-400 text-base">{presentation.date}</Text>
            <Image
              source={source}
              resizeMode="contain"
              className="h-[13px] w-[13px]"
              tintColor="grey"
              testID="presentation-history-dropdown-arrow"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View className="pb-2">
        {dropdownVisible && <HistoryDropdown claims={presentation.claims} />}
      </View>
    </View>
  );
};

export default PresentationHistory;
