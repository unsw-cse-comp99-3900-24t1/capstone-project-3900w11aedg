import React from 'react';
import { Image, View, Text } from 'react-native';

type Props = {
  isExpired: boolean;
};

const ExpiryStatusLabel = ({ isExpired }: Props): JSX.Element => {
  const source = isExpired
    ? require('../assets/white_cross.png')
    : require('../assets/white_tick.png');

  return (
    <View
      className={`px-2 py-0.5 rounded-xl flex-row items-center w-auto ${
        isExpired ? 'bg-invalid-red' : 'bg-valid-green'
      }`}
      testID="expiry-status-label"
    >
      <Image source={source} resizeMode="contain" className="h-[13px] w-[13px] mr-1" />
      <Text className="text-white text-base">{isExpired ? 'Expired' : 'Valid'}</Text>
    </View>
  );
};

export default ExpiryStatusLabel;
