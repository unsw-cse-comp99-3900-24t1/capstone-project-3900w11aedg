import { View, Alert } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScanQR from '../components/ScanQR';
import UploadQR from '../components/UploadQR';
import ScanSwitch from '../components/ScanSwitch';
import axios from 'axios';

type Props = NativeStackNavigationProp<RootStackParamList>;

function ScanScreen(): JSX.Element {
  const [method, setMethod] = React.useState<'Scan' | 'Upload'>('Scan');
  const navigation = useNavigation<Props>();
  const onRead = async (route: string) => {
    try {
      console.log(route);
      if (route.match('request-claims')) {
        console.log(route);
        // const response = await axios.get(smth);
        navigation.navigate('Present', { requestData: 'lol' });
      } else if (route.match('openid-credential-issuer')) {
        let issuer = route.split('cli\\')[1]; // remove once qr code fixe
        issuer = issuer?.split('\\.well-known')[0];
        console.log(route);
        console.log(issuer);
        if (issuer) {
          const response = await axios.post('http://localhost:3000/issuer/poll', {
            issuerUrl: 'http://localhost:3210',
          });
          console.log(response);
        }
      } else {
        Alert.alert('Error', 'Please scan a valid QR code from a service provider or issuer.');
        throw Error('Invalid QR code');
      }
    } catch (error) {
      console.log(error);
    }

    // request-claims/request-data
    // check if route is valid
    // Throw error -> gets an error alert/popup
    // else call route
    // Get payload and navigate to Present with it as param
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
