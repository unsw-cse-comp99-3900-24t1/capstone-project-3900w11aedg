import React from 'react';
import {Button, AppState} from 'react-native';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../config/types';
import * as Random from 'randomstring';
import {useNavigation} from '@react-navigation/native';

type Props = NativeStackNavigationProp<RootStackParamList, 'Login'>;

function LoginButton(): JSX.Element {
  const navigation = useNavigation<Props>();
  const handleBiometricAuth = async () => {
    const rnBiometrics = new ReactNativeBiometrics({allowDeviceCredentials: true});
    const {biometryType} = await rnBiometrics.isSensorAvailable();
    if (biometryType === BiometryTypes.Biometrics) {
      try {
        const res = await rnBiometrics.simplePrompt({
          promptMessage: 'Log in',
        });
        if (res.success) {
          const sessionToken = Random.generate(20);
          await Keychain.setGenericPassword('session', sessionToken);
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
    const checkToken = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          navigation.navigate('Home');
        } else {
          handleBiometricAuth();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleAppState = async (nextAppState: string) => {
      if (nextAppState === 'background') {
        await Keychain.resetGenericPassword();
        navigation.navigate('Login');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppState);
    checkToken();

    return () => {
      subscription.remove();
    };
  });

  return <Button title="Log in" color="grey" onPress={handleBiometricAuth} />;
}

export default LoginButton;
