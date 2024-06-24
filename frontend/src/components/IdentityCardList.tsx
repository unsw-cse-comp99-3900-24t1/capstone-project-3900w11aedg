import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import IdentityCard from './IdentityCard';

const IdentityCardList = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        { id: 1, name: 'Drivers License', type: 'License' },
        { id: 2, name: 'WCC', type: 'Certificate' },
        { id: 3, name: 'Drivers License', type: 'License' },
        { id: 4, name: 'WCC', type: 'Certificate' },
        { id: 5, name: 'Drivers License', type: 'License' },
        { id: 6, name: 'WCC', type: 'Certificate' },
        { id: 7, name: 'Drivers License', type: 'License' },
        { id: 8, name: 'WCC', type: 'Certificate' },
      ];
      setCards(data);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.list}>
      {cards.map((card) => (
        <IdentityCard key={card.id} card={card} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default IdentityCardList;
