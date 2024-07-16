import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
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
      const data = [
        {
          id: 1,
          creationDate: '15 Nov 2024',
          expiryDate: '15 Nov 2025',
          name: 'Drivers License',
          type: 'License',
          credIssuedBy: 'NSW Government',
          credNumber: '348203',
          credType: 'C LRN',
          credName: 'Lewis Hamilton',
        },
        {
          id: 2,
          creationDate: '23 Nov 2024',
          expiryDate: '23 Nov 2025',
          name: 'WCC',
          type: 'Certificate',
          credIssuedBy: 'NSW Government',
          credNumber: '46543346',
          credType: 'Employee',
          credName: 'Duke Dennis',
        },
        {
          id: 3,
          creationDate: '23 Nov 2024',
          expiryDate: '23 Nov 2025',
          name: 'Cocaine distributor',
          type: 'License',
          credIssuedBy: 'NSW Police',
          credNumber: '316385',
          credType: 'Owner',
          credName: 'Diana Daixing',
        },
      ];
      setCards(data);
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
