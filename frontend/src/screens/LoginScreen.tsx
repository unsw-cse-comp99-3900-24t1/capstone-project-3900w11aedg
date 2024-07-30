import React from 'react';
import Header from '../components/Header';
import { View, Image } from 'react-native';
import LoginButton from '../components/LoginButton';

function LoginScreen(): JSX.Element {
  return (
    <View className="flex items-center bg-light-cream dark:bg-dark-green h-[100%]">
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
