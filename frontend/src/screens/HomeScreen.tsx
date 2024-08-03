import { Alert, ScrollView, Text, View, TextInput, Image, Appearance } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IdentityCardList from '../components/IdentityCardList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SortButton from '../components/SortButton.tsx';
import { Card } from '../config/types.ts';
import fetchData from '../helper/data.ts';
import { useFocusEffect } from '@react-navigation/native';
import sortFunction from '../helper/sorting.ts';

const HomeScreen = (): JSX.Element => {
  const [cards, setCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
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

  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    try {
      fetchDID();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
        .then((data) => {
          data = sortFunction(data, 'pinned' as keyof Card);
          setCards(data);
          setFilteredCards(data);
        })
        .catch((error) => {
          console.error('Failed to fetch data:', error);
        });
    }, [])
  );

  useEffect(() => {
    const newFilteredCards = cards.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(newFilteredCards);
  }, [searchQuery, cards]);

  return (
    <View className="flex flex-col h-full w-full bg-light-cream text-text-black dark:text-white dark:bg-dark-green">
      <Header />
      <View className="w-4/5 flex flex-row justify-between mx-auto">
        <Text className="text-3xl font-bold text-text-black dark:text-white">Credentials</Text>
        <SortButton setCards={setCards} />
      </View>
      <View className="w-4/5 mx-auto my-2 flex flex-row items-center border border-gray-300 bg-search-light rounded dark:bg-white dark:border-dark-gray h-[40px]">
        <Image source={require('../assets/search.png')} className="ml-2.5 mr-1.5" />
        <TextInput
          className="flex-1 dark:text-black text-base pt-0 pb-0"
          placeholder="Search by credential name..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView className="w-full max-h-[67%]">
        <IdentityCardList cards={searchQuery ? filteredCards : cards} />
      </ScrollView>
      <Footer />
    </View>
  );
};

export default HomeScreen;
