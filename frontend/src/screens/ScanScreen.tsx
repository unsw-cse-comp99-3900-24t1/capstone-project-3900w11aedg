import { View, Alert } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScanQR from '../components/ScanQR';
import UploadQR from '../components/UploadQR';
import ScanSwitch from '../components/ScanSwitch';
import axios from 'axios';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Scan'>;
};

function ScanScreen({ navigation }: Props): JSX.Element {
  const [method, setMethod] = React.useState<'Scan' | 'Upload'>('Scan');
  const onRead = async (route: string) => {
    try {
      if (route.match('request-claims')) {
        const response = await axios.get(route);
        if (response.data) {
          navigation.navigate('Present', { requestData: response.data });
        } else {
          Alert.alert(
            'Service Provider Error',
            'This service provider failed to make a valid request'
          );
        }
      } else if (route.match('openid-credential-issuer')) {
        const response = await axios.post('http://localhost:3000/issuer/poll', {
          issuerUrl: route,
        });
        if (response.data) {
          navigation.navigate('Issue', { issuerMetadata: response.data });
        } else {
          Alert.alert('Issuer Error', 'There are no valid credentials offered from this issuer.');
        }
      } else {
        Alert.alert('Error', 'Please scan a valid QR code from a service provider or issuer.');
        throw Error('Invalid QR code');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <ScanSwitch method={method} setMethod={setMethod} />
      {method === 'Scan' ? <ScanQR onRead={onRead} /> : <UploadQR onRead={onRead} />}
      <Footer />
    </View>
  );
}

export default ScanScreen;
