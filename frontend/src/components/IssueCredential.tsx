import { View, TouchableHighlight, Text, Image } from 'react-native';
import React from 'react';
import { CredentialConfig } from '../config/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import addIcon from '../assets/add_icon.png';
import addedIcon from '../assets/green_added_icon.png';

type Props = {
  credentialOffer: CredentialConfig;
  backupName: string;
  isSelected: boolean;
  onSelect: () => void;
};

function IssueCredential({
  credentialOffer,
  backupName,
  isSelected,
  onSelect,
}: Props): JSX.Element {
  const [disabled, setDisabled] = React.useState(false);
  const [icon, setIcon] = React.useState(addIcon);

  const checkCredentialAdded = async () => {
    const keys = await AsyncStorage.getItem('keys');
    if (keys && JSON.stringify(keys).includes(backupName)) {
      setDisabled(true);
      setIcon(addedIcon);
    }
  };

  React.useEffect(() => {
    try {
      checkCredentialAdded();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <TouchableHighlight
      className={`self-center w-[90%] border-[1px] rounded-[5px] p-[15px] mt-[10px] border-black dark:border-white
        ${isSelected ? 'border-[2px] border-theme-gold' : ''}`}
      onPress={onSelect}
      disabled={disabled}
    >
      <View className="flex flex-row gap-[10px]">
        <Image
          className="w-[30px] h-[30px]"
          source={isSelected ? require('../assets/select_icon.png') : icon}
          resizeMode="contain"
        />
        <Text className={`text-xl ${isSelected ? 'text-black dark:text-white' : ''}`}>
          {credentialOffer?.display && credentialOffer.display[0]
            ? credentialOffer.display[0].name
            : backupName}
        </Text>
      </View>
    </TouchableHighlight>
  );
}

export default IssueCredential;
