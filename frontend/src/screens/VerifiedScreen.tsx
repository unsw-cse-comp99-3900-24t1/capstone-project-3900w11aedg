import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { RouteProp } from '@react-navigation/native';

type Props = {
  route: RouteProp<RootStackParamList, 'Verified'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Verified'>;
};

function VerifiedScreen({ route, navigation }: Props): JSX.Element {
  const { success } = route.params ?? false;
  const icon = success ? require('../assets/verified.png') : require('../assets/verify_fail.png');

  const handleNavButton = () => {
    if (success) {
      navigation.navigate('Home');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex flex-col h-full w-full bg-white dark:bg-dark-green">
      <Header />
      <View className="px-[5%]">
        <TouchableOpacity
          className="w-[30%] bg-theme-gold py-[3px] px-[20px] rounded-[15px]"
          onPress={handleNavButton}
        >
          <Text className="text-black text-lg font-medium text-center">
            {success ? 'Done' : 'Back'}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-col items-center px-[7%] pt-[10%]">
          <Text className="text-black dark:text-white mb-6 text-2xl font-medium text-center">
            {success
              ? 'Thank you! Your credentials have been verified'
              : 'Unfortunately, your credentials did not meet the requirements.'}
          </Text>
          {success ? (
            <></>
          ) : (
            <Text className="text-black dark:text-white text-lg py-[15px] text-center">
              Please contact your service provider for more details.
            </Text>
          )}
          <Image source={icon} className="h-[30%]" resizeMode="contain" />
        </View>
      </View>
      <Footer />
    </View>
  );
}

export default VerifiedScreen;
