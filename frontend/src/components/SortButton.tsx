import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { Card } from '../config/types.ts';
import SortOverlay from './SortOverlay.tsx';

type Props = {
  setCards: (cards: Card[]) => void;
};

const SortButton = ({ setCards }: Props): React.ReactElement => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortText, setSortText] = useState('Sort');
  return (
    <View
      className={`rounded-md px-3 py-1 border-2 border-white ${
        sortText !== 'Sort' ? 'bg-theme-gold' : 'bg-dark-green'
      }`}
    >
      <TouchableOpacity className="flex flex-row" onPress={() => setModalVisible(true)}>
        {sortText !== 'Sort' ? (
          <Image
            source={require('../assets/sort.png')}
            resizeMode="contain"
            className="mt-1 h-[13px] w-[13px] mr-1"
            testID="sort-icon-black"
          />
        ) : (
          <Image
            source={require('../assets/sort_white.png')}
            resizeMode="contain"
            className="mt-1 h-[13px] w-[13px] mr-1"
            testID="sort-icon-white"
          />
        )}
        <Text className={`text-center  ${sortText !== 'Sort' ? 'text-black' : 'text-white'}`}>
          {sortText}
        </Text>
        {sortText !== 'Sort' ? (
          <Image
            source={require('../assets/downwards_arrow_black.png')}
            resizeMode="contain"
            className="mt-1 h-[13px] w-[13px] ml-1"
          />
        ) : (
          <Image
            source={require('../assets/downwards_arrow.png')}
            resizeMode="contain"
            className="mt-1 h-[13px] w-[13px] ml-1"
          />
        )}
      </TouchableOpacity>
      <SortOverlay
        setCards={setCards}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSortText={setSortText}
        testID="sort-overlay"
      />
    </View>
  );
};

export default SortButton;
