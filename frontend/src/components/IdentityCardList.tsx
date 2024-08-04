import React from 'react';
import { View } from 'react-native';
import IdentityCard from './IdentityCard';
import { Card } from '../config/types';
type Props = {
  cards: Card[];
};

const IdentityCardList = ({ cards }: Props): JSX.Element => {
  return (
    <View className="flex flex-row flex-wrap mx-auto justify-center">
      {cards.map((card, index) => (
        <View key={index} className="m-2" testID="test">
          <IdentityCard card={card} />
        </View>
      ))}
    </View>
  );
};

export default IdentityCardList;
