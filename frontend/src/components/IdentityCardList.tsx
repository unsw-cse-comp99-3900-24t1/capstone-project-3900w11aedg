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
  credType: string;
  credName: string;
  creationDate: string;
  expiryDate: string;
}

const IdentityCardList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

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
              console.log(credentialsData);
              console.log(credentialSubject);
              console.log(typeof credentialsData.type);
              const credentialSubjectArray = [];
              let i = 0;
              Object.keys(credentialSubject).forEach((subjectKey) => {
                credentialSubjectArray[i] = credentialSubject[subjectKey];
                i++;
              });
              return {
                id: index + 1,
                name: key,
                type: credentialsData.type[0],
                credIssuedBy: credentialsData.issuer,
                credType: credentialSubjectArray[1],
                credName: credentialSubjectArray[0],
                creationDate: formatDate(credentialsData.issuanceDate),
                expiryDate: formatDate(credentialsData.expirationDate),
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
