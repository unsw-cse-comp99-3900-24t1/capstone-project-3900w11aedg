import React from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types.ts';
import OverlayComponent from './OverlayComponent';

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
      const presentations = await AsyncStorage.getItem('successfulPresentations');
      if (presentations) {
        await AsyncStorage.removeItem('successfulPresentations');
      }
      await AsyncStorage.removeItem('did');
      const keys = await Keychain.getAllGenericPasswordServices();
      const deletedKeys = keys.map((key: string) =>
        Keychain.resetGenericPassword({ service: key })
      );
      await Promise.all(deletedKeys);
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
    <OverlayComponent
      modalVisible={modalVisible}
      handleClose={handleClose}
      title="Do you wish to permanently delete your account?"
      description="All identifiers and credentials you own will be invalidated and removed. This action is irreversible!"
      leftOption="Cancel"
      handleDelete={handleDelete}
      rightOption="Delete Account"
    />
  );
};

export default DeleteOverlay;
