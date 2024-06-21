import React from 'react';
import {View, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function Header(): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View className={`pt-${insets.top} flex flex-row justify-between h-[100px] p-[20px]`}>
      <Image className="h-[40px] w-[40px]" source={require('../assets/smol_logo.png')} />
    </View>
  );
}

export default Header;
