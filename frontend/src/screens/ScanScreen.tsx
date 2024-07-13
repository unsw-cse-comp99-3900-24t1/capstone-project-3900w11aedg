import { View } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScanQR from '../components/ScanQR';
import UploadQR from '../components/UploadQR';
import ScanSwitch from '../components/ScanSwitch';

type Props = NativeStackNavigationProp<RootStackParamList>;

function ScanScreen(): JSX.Element {
  const [method, setMethod] = React.useState<'Scan' | 'Upload'>('Scan');
  const navigation = useNavigation<Props>();
  const onRead = async (route: string) => {
    console.log(route);
    // check if route is valid
    // Throw error -> gets an error alert/popup
    // else call route
    // Get payload and navigate to Present with it as param
    navigation.navigate('Present', { requestData: 'lol' });
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
