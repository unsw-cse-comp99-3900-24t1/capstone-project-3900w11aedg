import React, { useState } from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { Card } from '../config/types';
import PinOverlay from './PinOverlay.tsx';

type Props = {
  card: Card;
  additionalElements?: JSX.Element;
  isExpired: boolean;
};

const PinButton = ({ card, additionalElements, isExpired }: Props): JSX.Element => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)} className="flex flex-row items-center">
      <Image
        source={card.pinned ? require('../assets/pinned.png') : require('../assets/pin.png')}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor={isExpired ? 'black' : 'white'}
        testID="pin-button-icon"
      />
      <PinOverlay card={card} modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <View>{additionalElements}</View>
    </TouchableOpacity>
  );
};

export default PinButton;
