import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type Props = {
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<'Scan' | 'Upload'>>;
};

const ScanSwitch = ({ method, setMethod }: Props): React.ReactElement => {
  return (
    <View className="w-[80%] flex flex-row justify-center self-center">
      <TouchableOpacity
        className={method === 'Scan' ? switchButton + toggled : switchButton}
        onPress={() => setMethod('Scan')}
      >
        <Text className={method === 'Scan' ? switchText + toggled : switchText}>Scan QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={method === 'Upload' ? switchButton + toggled : switchButton}
        onPress={() => setMethod('Upload')}
      >
        <Text className={method === 'Upload' ? switchText + toggled : switchText}>
          Upload QR Code
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const switchText = 'text-xl text-text-black dark:text-blurred-grey';
const switchButton = 'border-b-[1px] border-text-black dark:border-blurred-grey p-[5px]';
const toggled = ' text-theme-gold font-medium border-theme-gold';

export default ScanSwitch;
