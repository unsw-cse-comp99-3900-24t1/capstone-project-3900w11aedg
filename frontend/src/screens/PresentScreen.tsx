import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PresentDetails from '../components/PresentDetails';

type Props = {
  route: RouteProp<RootStackParamList, 'Present'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Present'>;
};

const PresentScreen = ({ route, navigation }: Props): React.ReactElement => {
  const { requestData } = route.params ?? '';

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-light-cream dark:bg-dark-green">
      <Header />
      <ScrollView className="mb-20">
        <View className="px-[5%]">
          <TouchableOpacity
            className="w-[30%] bg-theme-gold py-[3px] px-[20px] rounded-[15px]"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-black text-lg font-medium text-center">Back</Text>
          </TouchableOpacity>
          <Text className="text-black dark:text-white text-3xl font-medium mt-[10px]">
            {requestData?.query
              ? 'Select which credential detail to present'
              : "Your service provider's request was invalid."}
          </Text>
          {!requestData?.query ? <></> : <PresentDetails claimsRequest={requestData} />}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default PresentScreen;
