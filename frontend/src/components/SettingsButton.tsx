import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  isFirst: boolean;
  imageSource: number;
  text: string;
  secondImageSource: number;
  handlePress?: () => void;
  additionalElements?: React.ReactElement;
};

const SettingsButton = ({
  isFirst,
  imageSource,
  text,
  secondImageSource,
  handlePress,
  additionalElements,
}: Props): React.ReactElement => {
  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <View className={`flex flex-row ${!isFirst && 'border-t-[1px] border-white'}`}>
          <Image
            source={imageSource}
            resizeMode="contain"
            className="h-[15px] w-[15px] my-3.5 ml-4"
            testID="settings-button-icon-left"
          />
          <Text className="ml-3 text-white mt-2.5 text-base">{text}</Text>
          <Image
            source={secondImageSource}
            resizeMode="contain"
            className="h-[15px] w-[15px] my-3.5 ml-auto mr-4"
            testID="settings-button-icon-right"
          />
        </View>
      </TouchableOpacity>
      <View>{additionalElements}</View>
    </View>
  );
};
export default SettingsButton;
