import { ScrollView, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import { setGenericPassword } from 'react-native-keychain';
import '../../shim.js';
import crypto from 'crypto';
import IdentityCardList from '../components/IdentityCardList.tsx';

function HomeScreen() {
  const [did, setDID] = useState<string | null>(null);

  const fetchDid = async () => {
    const storedDid = await AsyncStorage.getItem('did');
    if (storedDid) {
      setDID(storedDid);
    } else {
      const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });
      const response = await axios.post('http://localhost:3000/generate/did', {
        publicKey: keyPair.publicKey,
      });
      const newDid = response.data.did;
      await AsyncStorage.setItem('did', newDid);
      // await setGenericPassword('privateKey', keyPair.privateKey);
      setDID(newDid);
    }
  };

  useEffect(() => {
    fetchDid().catch((error) => console.log(error));
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
