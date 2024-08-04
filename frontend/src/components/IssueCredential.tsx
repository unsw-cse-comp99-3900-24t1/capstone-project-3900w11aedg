import { View, TouchableHighlight, Text, Image, Alert } from 'react-native';
import React from 'react';
import * as Keychain from 'react-native-keychain';
import { CredentialConfig } from '../config/types';
import addIcon from '../assets/add_icon.png';
import addedIcon from '../assets/green_added_icon.png';
import { normaliseKey } from '../helper/normalise.ts';

type Props = {
  credentialOffer: CredentialConfig;
  backupName: string;
  isSelected: boolean;
  onSelect: () => void;
};

const IssueCredential = ({
  credentialOffer,
  backupName,
  isSelected,
  onSelect,
}: Props): React.ReactElement => {
  const [disabled, setDisabled] = React.useState(false);
  const [icon, setIcon] = React.useState(addIcon);

  const checkCredentialAdded = async () => {
    const keys = await Keychain.getAllGenericPasswordServices();
    if (keys && keys.includes(backupName)) {
      setDisabled(true);
      setIcon(addedIcon);
    }
  };

  React.useEffect(() => {
    try {
      checkCredentialAdded();
    } catch (error) {
      Alert.alert('Error', 'Failed to check if credential is added');
    }
  });

  return (
    <TouchableHighlight
      className={`self-center w-fit border-[1px] rounded-[5px] p-[15px] mt-[10px] border-black dark:border-white
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
            : normaliseKey(backupName)}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default IssueCredential;
