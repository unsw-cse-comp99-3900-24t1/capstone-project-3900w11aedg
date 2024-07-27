import { Alert, Button, ScrollView, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IdentityCardList from '../components/IdentityCardList';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as Keychain from 'react-native-keychain';

function HomeScreen(): JSX.Element {
  const fetchDid = async () => {
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
      fetchDid();
    } catch (error) {
      console.error(error);
    }
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
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Button
        title="Generate DID"
        onPress={async () => {
          try {
            await fetchDid();
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
