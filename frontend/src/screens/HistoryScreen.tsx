import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RootStackParamList } from '../config/types.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PresentationHistoryList from '../components/PresentationHistoryList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClearHistoryOverlay from '../components/ClearHistoryOverlay';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

const HistoryScreen = (): JSX.Element => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const [successfulPresentations, setSuccessfulPresentations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const getSuccessfulPresentations = async () => {
    try {
      const presentations = await AsyncStorage.getItem('successfulPresentations');
      return presentations ? JSON.parse(presentations) : [];
    } catch (error) {
      console.error('Error retrieving successful presentations: ', error);
      return [];
    }
  };

  const clearPresentationHistory = async () => {
    try {
      await AsyncStorage.removeItem('successfulPresentations');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Could not clear history. Please try again later.');
    }
  };

  const handleClearHistory = async () => {
    await clearPresentationHistory();
    setSuccessfulPresentations([]);
  };

  useEffect(() => {
    const fetchPresentations = async () => {
      const storedPresentations = await getSuccessfulPresentations();
      setSuccessfulPresentations(storedPresentations);
    };
    fetchPresentations();
  }, [successfulPresentations]);

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <View className="flex flex-col px-[5%] h-[100%]">
        <TouchableOpacity
          className="w-[30%] bg-theme-gold py-[px] rounded-[15px]"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black text-lg font-medium text-center">Back</Text>
        </TouchableOpacity>
        <Text className="mt-[5%] font-medium text-3xl text-text-grey dark:text-white mb-2">
          Presentation History
        </Text>
        {successfulPresentations.length ? (
          <View className="flex-1">
            <PresentationHistoryList presentations={successfulPresentations} />
            <View className="items-center justify-end p-4">
              <TouchableOpacity
                className="bg-theme-gold px-3 pt-[1] pb-[1] rounded-[15px]"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-black text-lg font-medium text-center">Clear history</Text>
              </TouchableOpacity>
              <ClearHistoryOverlay
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleDelete={handleClearHistory}
              />
            </View>
          </View>
        ) : (
          <Text className="text-white text-xl m-2">No successful presentations to show.</Text>
        )}
      </View>
      <Footer />
    </View>
  );
};

export default HistoryScreen;
