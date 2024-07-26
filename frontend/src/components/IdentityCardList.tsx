import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import IdentityCard from './IdentityCard';

interface Card {
  id: number;
  name: string;
  type: string;
  credIssuedBy: string;
  credNumber: string;
  credType: string;
  credName: string;
  creationDate: string;
  expiryDate: string;
}

const IdentityCardList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keysString = await AsyncStorage.getItem('keys');
        const keys = JSON.parse(keysString ?? '[]');
        const dataPromises = keys.map(async (key, index) => {
          try {
            const credentials = await Keychain.getGenericPassword({ key });
            if (credentials) {
              const credentialsData = JSON.parse(credentials.password);
              const credentialSubject = credentialsData.credentialSubject;

              return {
                id: index + 1,
                name: key,
                type: credentialsData.type,
                credIssuedBy: credentialsData.issuer,
                credNumber: '34839',
                credType: credentialSubject.degree,
                credName: 'jamie boss',
                creationDate: credentialsData.issuanceDate,
                expiryDate: credentialsData.issuanceDate,
              };
            } else {
              console.log(`No data found for key ${key}`);
              return null;
            }
          } catch (error) {
            console.error(`Failed to retrieve data for key ${key}:`, error);
            return null;
          }
        });
        const data = await Promise.all(dataPromises);
        const validData = data.filter((item) => item !== null);
        setCards(validData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <View className="flex flex-row flex-wrap justify-center">
      {cards.map((card) => (
        <View key={card.id} className="m-2">
          <IdentityCard card={card} />
        </View>
      ))}
    </View>
  );
};

export default IdentityCardList;
