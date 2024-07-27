import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClaimsList from '../components/ClaimsList';

type Props = {
  route: RouteProp<RootStackParamList, 'Present'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Present'>;
};

export default function PresentScreen({ route, navigation }: Props): JSX.Element {
  const { requestData } = route.params ?? '';
  console.log(requestData);

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <View className="px-[5%]">
        <TouchableOpacity
          className="w-[30%] bg-theme-gold py-[3px] px-[20px] rounded-[15px]"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black text-lg font-medium text-center">Back</Text>
        </TouchableOpacity>
        <Text className="text-black dark:text-white text-3xl font-medium mt-[5px]">
          Select which credential detail to present
        </Text>
        {requestData?.query ? <ClaimsList claimsRequest={requestData} /> : <></>}
      </View>
      <Footer />
    </View>
  );
}
