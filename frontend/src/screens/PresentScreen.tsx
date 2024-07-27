import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Props = NativeStackNavigationProp<RootStackParamList>;

export default function PresentScreen(): JSX.Element {
  const navigation = useNavigation<Props>();

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <ScrollView className="flex flex-col px-[5%]">
        <TouchableOpacity
          className="w-[30%] bg-theme-gold py-[3px] px-[20px] rounded-[15px]"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black text-lg font-medium text-center">Back</Text>
        </TouchableOpacity>
        <Text>PresentScreen</Text>
      </ScrollView>
      <Footer />
    </View>
  );
}
