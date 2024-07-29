import React from 'react';
import { View } from 'react-native';
import IdentityCard from './IdentityCard';
import { Card } from '../config/types';
type Props = {
  cards: Card[];
};

const IdentityCardList = ({ cards }: Props) => {
  return (
    <View className="flex flex-row flex-wrap mx-auto justify-center">
      {cards.map((card) => (
        <View key={card.id} className="m-2">
          <IdentityCard card={card} />
        </View>
      ))}
    </View>
  );
};

export default IdentityCardList;
