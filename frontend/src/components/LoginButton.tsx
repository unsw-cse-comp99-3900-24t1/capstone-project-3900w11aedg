import React from 'react';
import { Button, AppState } from 'react-native';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackNavigationProp<RootStackParamList, 'Login'>;

function LoginButton(): JSX.Element {
  const navigation = useNavigation<Props>();

  // Prompts user to enter biometric data, navigating to homescreen with success case
  const handleBiometricAuth = async () => {
    const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
    const { biometryType } = await rnBiometrics.isSensorAvailable();
    if (biometryType === BiometryTypes.Biometrics) {
      try {
        const res = await rnBiometrics.simplePrompt({
          promptMessage: 'Log in',
        });
        if (res.success) {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // If user has no security feature set
      navigation.navigate('Home');
    }
  };

  React.useEffect(() => {
    handleBiometricAuth();
    const handleAppState = async (nextAppState: string) => {
      if (nextAppState === 'background') {
        navigation.navigate('Login');
      } else if (nextAppState === 'active') {
        handleBiometricAuth();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppState);

    return () => {
      subscription.remove();
    };
  });

  return <Button title="Log in" color="grey" onPress={handleBiometricAuth} />;
}

export default LoginButton;
