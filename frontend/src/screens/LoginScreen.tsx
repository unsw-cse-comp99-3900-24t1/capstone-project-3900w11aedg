import {useTheme} from '@react-navigation/native';
import React from 'react';
import {ScrollView, Text} from 'react-native';

function LoginScreen(): JSX.Element {
  const {colors} = useTheme();
  return (
    <ScrollView style={{backgroundColor: colors.background}}>
      <Text>Login</Text>
    </ScrollView>
  );
}

export default LoginScreen;
