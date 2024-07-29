import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  isFirst: boolean;
  imageSource: number;
  text: string;
  secondImageSource: number;
  handlePress?: () => void;
  additionalElements?: JSX.Element;
};

const SettingsButton = ({
  isFirst,
  imageSource,
  text,
  secondImageSource,
  handlePress,
  additionalElements,
}: Props) => {
  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <View className={`flex flex-row ${!isFirst && 'border-t-[1px] border-white'}`}>
          <Image
            source={imageSource}
            resizeMode="contain"
            className="h-[15px] w-[15px] my-3.5 ml-4"
          />
          <Text className="ml-3 mt-2.5 text-base">{text}</Text>
          <Image
            source={secondImageSource}
            resizeMode="contain"
            className="h-[15px] w-[15px] my-3.5 ml-auto mr-4"
          />
        </View>
      </TouchableOpacity>
      <View>{additionalElements}</View>
    </View>
  );
};
export default SettingsButton;
