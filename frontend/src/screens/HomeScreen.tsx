import { Alert, ScrollView, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IdentityCardList from '../components/IdentityCardList';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomeScreen(): JSX.Element {
  const fetchDid = async () => {
    const storedDid = await AsyncStorage.getItem('did');
    if (!storedDid) {
      try {
        const response = await axios.post('http://localhost:3000/generate/did', {});
        const newDid = response.data.did;
        await AsyncStorage.setItem('did', newDid);
      } catch (error) {
        Alert.alert('No DID found');
      }
    }
  };

  useEffect(() => {
    try {
      fetchDid();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <ScrollView>
        <Text className="text-[28px] p-[10] px-[30] font-bold text-text-grey dark:text-white">
          Credentials
        </Text>
        <IdentityCardList />
      </ScrollView>
      <Footer />
    </View>
  );
}

export default HomeScreen;
