import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Footer(): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`pt-${insets.bottom} pl-${insets.left} pr-${insets.right} flex flex-row justify-evenly items-center h-[10%] w-[100%] bg-navbar-grey`}
    >
      <TouchableOpacity className="basis-[20%] flex items-center gap-1">
        <Image
          source={require('../assets/credentials.png')}
          resizeMode="contain"
          className="w-[40%] h-[40%]"
        />
        <Text className="text-theme-gold">Credentials</Text>
      </TouchableOpacity>
      <TouchableOpacity className="basis-[30%] flex items-center gap-1">
        <Image
          source={require('../assets/scan.png')}
          resizeMode="contain"
          className="w-[50%] h-[50%]"
        />
        <Text className="text-theme-gold">Scan</Text>
      </TouchableOpacity>
      <TouchableOpacity className="basis-[20%] flex items-center gap-1">
        <Image
          source={require('../assets/settings.png')}
          resizeMode="contain"
          className="w-[35%] h-[35%]"
        />
        <Text className="text-theme-gold">Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Footer;
