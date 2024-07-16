import { View, Modal, Text, Pressable, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';

type Props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};
type NavProps = NativeStackNavigationProp<RootStackParamList>;

function AddedCredPopup({ modalVisible, setModalVisible }: Props): JSX.Element {
  const navigation = useNavigation<NavProps>();

  const handleClose = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={handleClose}>
      <Pressable
        className="flex-1 justify-center items-center bg-dark-green opacity-80"
        onPress={handleClose}
      >
        <View className="flex flex-col justify-between items-center w-[35%] h-[20%] bg-popup-grey rounded-[15px] p-[25px]">
          <Text className="text-xl font-medium text-white text-center">Added to Wallet</Text>
          <Image
            source={require('../assets/white_tick.png')}
            resizeMode="contain"
            className="h-[40%]"
          />
        </View>
      </Pressable>
    </Modal>
  );
}

export default AddedCredPopup;
