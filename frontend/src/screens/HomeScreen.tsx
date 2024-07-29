import { Alert, ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IdentityCardList from '../components/IdentityCardList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SortButton from '../components/SortButton.tsx';
import { Card } from '../config/types.ts';
import fetchData from '../helper/data.ts';

function HomeScreen(): JSX.Element {
  const [cards, setCards] = useState<Card[]>([]);
  const fetchDID = async () => {
    const did = await AsyncStorage.getItem('did');
    if (!did) {
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
      fetchDID();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setCards(data);
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
      });
  }, []);

  return (
    <View className="flex flex-col h-full w-full bg-white dark:bg-dark-green">
      <Header />
      <View className="w-4/5 flex flex-row justify-between mx-auto">
        <Text className="text-2xl font-bold dark:text-white">Credentials</Text>
        <SortButton setCards={setCards} />
      </View>
      <ScrollView className="w-full">
        <IdentityCardList cards={cards} />
      </ScrollView>
      <Footer />
    </View>
  );
}

export default HomeScreen;
