import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RootStackParamList } from '../config/types.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PresentationHistoryList from '../components/PresentationHistoryList';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const presentations = [1,2,3];

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
        <Text className="mt-[5%] font-medium text-3xl text-text-grey dark:text-white mb-2">Presentation History</Text>
        <PresentationHistoryList presentations={presentations}/>
      </View>
      <Footer />
    </View>
  );
};

export default HistoryScreen;