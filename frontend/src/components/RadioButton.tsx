import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
};

const RadioButton = ({ label, value, selected, onSelect }: Props): JSX.Element => {
  return (
    <TouchableOpacity className="flex-row items-center mb-2" onPress={() => onSelect(value)}>
      {selected ? (
        <View className="h-3 w-3 border-4 border-theme-gold rounded-full" />
      ) : (
        <View className="h-3 w-3 border-2 border-white rounded-full white bg-none" />
      )}
      <Text className="ml-2 text-sm text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default RadioButton;
