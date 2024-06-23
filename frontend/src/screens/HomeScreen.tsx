import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

function HomeScreen() {
  const [did, setDID] = useState<string | null>(null);

  const getDID = async () => {
    try {
      const storedDid = await AsyncStorage.getItem('did');
      if (storedDid == null) {
        const keyPair = await window.crypto.subtle.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
          },
          true,
          ['encrypt', 'decrypt']
        );
        const createdDid = await axios.post('http://localhost:3000/generate', {
          publicKey: keyPair.publicKey,
        });
        setDID(createdDid.data.did);
        await AsyncStorage.setItem('did', createdDid.data.did);
      } else {
        setDID(storedDid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDID().catch((error) => console.log(error));
  }, []);

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>Your DID is {did}</Text>
    </View>
  );
}

export default HomeScreen;
