import React from 'react';
import { Image, View, Text } from 'react-native';

type Props = {
  isExpired: boolean;
};

const ExpiryStatusLabel = ({ isExpired }: Props) => {
  const source = isExpired
    ? require('../assets/white_cross.png')
    : require('../assets/white_tick.png');

  return (
    <View
      className={`mx-1 px-1.5 pt-0.5 pb-0.5 rounded-xl flex-row items-center w-auto ${
        isExpired ? 'bg-invalid-red' : 'bg-valid-green'
      }`}
    >
      <Image source={source} resizeMode="contain" className="h-[13px] w-[13px] mr-1" />
      <Text className="text-white">{isExpired ? 'Expired' : 'Valid'}</Text>
    </View>
  );
};

export default ExpiryStatusLabel;
