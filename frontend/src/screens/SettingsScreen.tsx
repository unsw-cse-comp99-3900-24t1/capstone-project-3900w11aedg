import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import SettingsButton from '../components/SettingsButton.tsx';
import DeleteOverlay from '../components/DeleteOverlay.tsx';
import { RootStackParamList } from '../config/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-light-cream dark:bg-dark-green">
      <Header />
      <Text className="ml-10 text-text-black dark:text-white text-3xl font-bold">Settings</Text>
      <Text className="ml-10 text-text-black dark:text-white mt-6 text-2xl">
        Account and Security
      </Text>
      <View className="flex flex-col bg-view-light dark:bg-settings-grey rounded-lg mt-4 mx-auto w-80">
        <SettingsButton
          isFirst={true}
          imageSource={require('../assets/bin.png')}
          text={'Delete Account'}
          secondImageSource={require('../assets/right-arrow.png')}
          handlePress={() => setModalVisible(true)}
          additionalElements={
            <DeleteOverlay modalVisible={modalVisible} setModalVisible={setModalVisible} />
          }
        />
      </View>
      <Text className="ml-10 mt-6 text-2xl text-text-black dark:text-white">
        Preferences and History
      </Text>
      <View className="flex flex-col bg-view-light dark:bg-settings-grey rounded-lg mt-4 mx-auto w-80">
        <SettingsButton
          isFirst={true}
          imageSource={require('../assets/clock.png')}
          text={'Presentation History'}
          secondImageSource={require('../assets/right-arrow.png')}
          handlePress={() => navigation.navigate('History')}
        />
      </View>
      <Footer />
    </View>
  );
};

export default SettingsScreen;
