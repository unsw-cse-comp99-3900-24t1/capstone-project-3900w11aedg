import React from 'react';
import Header from '../components/Header';
import { View, Image } from 'react-native';
import LoginButton from '../components/LoginButton';
import { useTheme } from '@react-navigation/native';
import { ColourTheme } from '../config/colours';

function LoginScreen(): JSX.Element {
  const { colors } = useTheme() as ColourTheme;

  return (
    <View className={`flex items-center bg-${colors.background} h-[100%]`}>
      <Header />
      <Image
        source={require('../assets/large_logo.png')}
        className="w-[50%] h-[50%]"
        resizeMode="contain"
      />
      <LoginButton />
    </View>
  );
}

export default LoginScreen;
