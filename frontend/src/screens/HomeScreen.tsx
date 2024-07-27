import { Alert, ScrollView, Text, Button, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IdentityCardList from '../components/IdentityCardList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SortButton from '../components/SortButton.tsx';
import { Card } from '../config/types.ts';
import fetchData from '../helper/data.ts';
import * as Keychain from 'react-native-keychain';

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

  const removeCredentials = async () => {
    try {
      const keys = JSON.parse((await AsyncStorage.getItem('keys')) ?? '[]');
      for (const key of keys) {
        await Keychain.resetGenericPassword(key);
      }
      await AsyncStorage.removeItem('keys');
      Alert.alert('Credentials cleared');
    } catch (error) {
      Alert.alert('Failed to clear credentials');
    }
  };

  return (
    <View className="flex flex-col h-full w-full bg-white dark:bg-dark-green">
      <Button
        title="Generate DID"
        onPress={async () => {
          try {
            await fetchDID();
            Alert.alert('DID generated');
          } catch (error) {
            Alert.alert('Failed to generate DID');
          }
        }}
      />
      <Button title="Remove DID" onPress={() => AsyncStorage.removeItem('did')} />
      <Button
        title={'Remove credentials'}
        onPress={async () => {
          try {
            await removeCredentials();
          } catch (error) {
            Alert.alert('Failed to remove credentials');
          }
        }}
      />
      <Header />

      <View className="w-4/5 flex flex-row justify-between mx-auto">
        <Text className="text-xl font-bold dark:text-white">Credentials</Text>
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
