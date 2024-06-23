import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import '../../shim.js';
import crypto from 'crypto';

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
      setDID(newDid);
    }
  };

  useEffect(() => {
    fetchDid().catch((error) => console.log(error));
  }, []);

  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>Your DID is {did}</Text>
    </View>
  );
}

export default HomeScreen;
