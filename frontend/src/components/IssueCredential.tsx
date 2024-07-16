import { View, TouchableHighlight, Text, Image } from 'react-native';
import React from 'react';
import { CredentialOffer } from '../config/types';

type Props = {
  credentialOffer: CredentialOffer;
  isSelected: boolean;
  onSelect: () => void;
};

function IssueCredential({ credentialOffer, isSelected, onSelect }: Props): JSX.Element {
  // render text inside as either key value or display name
  console.log(credentialOffer);

  return (
    <TouchableHighlight
      className={`self-center w-[90%] border-[1px] rounded-[5px] p-[15px] mt-[10px] border-black dark:border-white
        ${isSelected ? 'border-[2px] border-theme-gold' : ''}`}
      onPress={onSelect}
    >
      <View className="flex flex-row gap-[10px]">
        <Image
          className="w-[30px] h-[30px]"
          source={
            isSelected ? require('../assets/select_icon.png') : require('../assets/add_icon.png')
          }
          resizeMode="contain"
        />
        <Text className={`text-xl ${isSelected ? 'text-black dark:text-white' : ''}`}>hello</Text>
      </View>
    </TouchableHighlight>
  );
}

export default IssueCredential;
