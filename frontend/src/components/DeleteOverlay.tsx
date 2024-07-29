import React from 'react';
import { Alert, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types.ts';

type Props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

type DeleteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const DeleteOverlay = ({ modalVisible, setModalVisible }: Props) => {
  const navigation = useNavigation<DeleteNavigationProp>();
  const handleClose = () => {
    setModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      const result = await axios.delete('http://localhost:3000/delete/did');
      if (result.status !== 200) {
        throw new Error('Could not delete account. Please try again later.');
      }
      const did = await AsyncStorage.getItem('did');
      if (!did) {
        throw new Error('Could not delete account. Please try again later.');
      }
      await AsyncStorage.removeItem('did');
      const keys = JSON.parse((await AsyncStorage.getItem('keys')) ?? '[]');
      const deletedKeys = keys.map((key: string) =>
        Keychain.resetGenericPassword({ service: key })
      );
      await Promise.all(deletedKeys);
      await AsyncStorage.removeItem('keys');
      setModalVisible(false);
      Alert.alert(
        'Success',
        'Account deleted successfully. You will now be sent to the Login Page'
      );
      navigation.navigate('Login');
    } catch (error) {
      setModalVisible(false);
      Alert.alert('Error', 'Could not delete account. Please try again later.');
    }
  };
  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={handleClose}>
      <Pressable
        className="flex-1 justify-center items-center bg-dark-green opacity-90"
        onPress={handleClose}
      >
        <View className="bg-settings-grey w-90 h-200 rounded-2xl">
          <View className={'flex flex-col'} />
          <Text className="text-2xl my-2 mx-auto text-center font-bold pt-4 px-4 pb-4">
            Do you wish to permanently delete your account?
          </Text>
          <Text className={'text-base pt-2 px-4 pb-6'}>
            All identifiers and credentials you own will be invalidated and removed.
          </Text>
          <View className="flex flex-row mx-4 mb-4 ">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-blurred-grey rounded-md mr-2 text-center"
            >
              <Text className="mx-auto font-bold text-base py-2">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 bg-red-500 rounded-md text-center"
            >
              <Text className="mx-auto font-bold text-base py-2">Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default DeleteOverlay;
