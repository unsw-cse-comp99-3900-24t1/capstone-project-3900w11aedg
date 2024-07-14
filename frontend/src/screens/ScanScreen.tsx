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
      if (!route.match('request-claims')) {
        Alert.alert('Error', 'Please scan a valid QR code.');
        throw Error('Invalid QR code');
      }
      console.log(route);
      const response = await axios.get(route);
      console.log(response);
      navigation.navigate('Present', { requestData: 'lol' });
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
