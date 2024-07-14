import { View, ScrollView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setGenericPassword } from 'react-native-keychain';
import { RSA } from 'react-native-rsa-native';
import IdentityCardList from '../components/IdentityCardList';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomeScreen(): JSX.Element {
  const [did, setDID] = useState<string | null>(null);
  console.log(did);

  const fetchDid = async () => {
    const storedDid = await AsyncStorage.getItem('did');
    if (storedDid) {
      setDID(storedDid);
    } else {
      const keyPair = await RSA.generateKeys(4096);
      const response = await axios.post('http://10.0.2.2:3000/generate/did');
      console.log('res received');
      // console.log(response);
      const newDid = response.data.did;
      // await AsyncStorage.setItem('did', newDid);
      await setGenericPassword('privateKey', keyPair.private);
      setDID(newDid);
    }
  };

  useEffect(() => {
    fetchDid().catch((error) => {
      console.log(error);
      console.log(error.message);
    });
  }, []);

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <ScrollView>
        <Text className="text-[28px] p-[30] font-bold text-text-grey dark:text-white">
          Credentials
        </Text>
        <IdentityCardList />
      </ScrollView>
      <Footer />
    </View>
  );
}

export default HomeScreen;
