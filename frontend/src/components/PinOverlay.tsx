import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types.ts';
import pinCard from '../helper/pinning.ts';
import { Card } from '../config/types.ts';

type Props = {
  card: Card;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const PinOverlay = ({ card, modalVisible, setModalVisible }: Props): React.ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleClose = () => {
    setModalVisible(false);
  };
  const handlePin = () => {
    pinCard(card);
    setModalVisible(false);
    navigation.replace('Home');
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
      testID="pin-overlay"
    >
      <Pressable
        className="flex-1 justify-center items-center bg-dark-green opacity-90"
        onPress={handleClose}
      >
        <View className="bg-settings-grey w-[80%] h-200 rounded-2xl">
          <View className={'flex flex-col'} />
          {card.pinned ? (
            <Text className="text-2xl my-2 mx-auto text-white text-center font-bold pt-4 px-4 pb-4">
              Unpin from Wallet?
            </Text>
          ) : (
            <Text className="text-2xl my-2 mx-auto text-white text-center font-bold pt-4 px-4 pb-4">
              Pin to Wallet?
            </Text>
          )}
          <View className="flex flex-row mx-4 mb-4 ">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-blurred-grey rounded-md mr-2 text-center"
            >
              <Text className="mx-auto font-bold text-white text-base py-2">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePin}
              className="flex-1 bg-yellow-500 rounded-md text-center"
            >
              <Text className="mx-auto font-bold text-white text-base py-2">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PinOverlay;
