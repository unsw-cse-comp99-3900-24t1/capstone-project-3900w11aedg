import { ScrollView, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { setGenericPassword } from 'react-native-keychain';
import { RSA } from 'react-native-rsa-native';
import IdentityCardList from '../components/IdentityCardList.tsx';

function HomeScreen() {
  const [did, setDID] = useState<string | null>(null);

  const fetchDid = async () => {
    const storedDid = await AsyncStorage.getItem('did');
    if (storedDid) {
      setDID(storedDid);
    } else {
      const keyPair = await RSA.generateKeys(4096);
      const response = await axios.post('http://10.0.2.2:3000/generate/did', {
        publicKey: keyPair.public,
      });
      const newDid = response.data.did;
      await AsyncStorage.setItem('did', newDid);
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
    <ScrollView>
      <Text>Your DID is {did}</Text>
      <Text style={styles.mainTitle}>Credentials</Text>
      <IdentityCardList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 28,
    padding: 30,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
