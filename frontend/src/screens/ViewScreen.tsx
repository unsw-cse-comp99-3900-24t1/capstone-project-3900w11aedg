import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LinearGradient from 'react-native-linear-gradient';
import ExpiryStatusLabel from '../components/ExpiryStatusLabel';
import { formatDate } from '../helper/data.ts';
import { Card } from '../config/types.ts';
import { normaliseURL } from '../helper/normalise.ts';

type RootStackParamList = {
  ViewScreen: {
    card: Card;
  };
};

type ViewScreenRouteProp = RouteProp<RootStackParamList, 'ViewScreen'>;

const ViewScreen: React.FC = () => {
  const route = useRoute<ViewScreenRouteProp>();
  const { card } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonPress = () => {
    navigation.navigate('Home', { card });
  };

  const handleRemoveConfirmation = () => {
    navigation.navigate('Home', { card });
  };

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(card.expiryDate) < new Date(new Date().getTime() + offset);

  const gradientColour = isExpired ? ['#606665', '#606665'] : ['#1F2A29', '#527E78'];
  const formattedExpiryDate = new Date(card.expiryDate).toDateString().toString();

  return (
    <View className="w-[100%] flex-1 bg-white dark:bg-dark-green">
      <Header />
      <View className="px-12 py-5">
        <Pressable onPress={handleButtonPress} className="w-[27%] bg-theme-gold p-2 rounded-3xl ">
          <Text className="font-medium text-black text-center text-base">Done</Text>
        </Pressable>
      </View>
      <View className="h-[65%] flex items-center space-y-5">
        <LinearGradient colors={gradientColour} className="rounded-2xl">
          <View className="h-40 w-[80%] rounded-md overflow-hidden p-4">
            <View className="flex-row justify-between">
              <Text className="text-xl text-white font-bold p-4">{card.name}</Text>
            </View>
            <View className="flex-1 p-4 justify-end">
              <Text className="text-white font-bold text-base">{card.type}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-base mr-4">
                  Expiry: <Text className="font-bold">{formattedExpiryDate}</Text>
                </Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="w-[90%] bg-card-view-grey rounded-2xl space-y-5 p-5">
          <View className="p-3 bg-popup-grey rounded-lg justify-around">
            <Text className="text-white font-bold">Pin to Wallet</Text>
          </View>
          <View className="w-[100%] bg-popup-grey rounded-lg flex-row p-3 space-x-5 rounded-2xl">
            <View>
              <Text className="text-white font-medium">Issued By</Text>
              <Text className="text-white font-medium">Issued at</Text>
              <Text className="text-white font-medium">Expiry</Text>
            </View>
            <View>
              <Text className="text-grey">{normaliseURL(card.credIssuedBy)}</Text>
              <Text className="text-grey">{formatDate(card.issuanceDate)}</Text>
              <Text className="text-grey">{formatDate(card.expiryDate)}</Text>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 items-center justify-center bg-dark-green opacity-80">
              <View className="w-[80%] bg-dark-grey p-5 flex align-center rounded-md space-y-5">
                <Text className="text-white px-5">
                  Do you wish to permanently remove this credential from your wallet?
                </Text>
                <View className="flex flex-row justify-around w-[100%]">
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Text className="text-white font-medium bg-gray-500 p-2 rounded-md px-4">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleRemoveConfirmation();
                      setModalVisible(false);
                    }}
                  >
                    <Text className="text-white font-medium bg-red-500 p-2 rounded-md px-4">
                      Remove
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Pressable onPress={() => setModalVisible(true)}>
            <View className="p-3 bg-popup-grey rounded-lg justify-around">
              <Text className="text-red-500 font-bold">Remove Credential</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <Footer />
    </View>
  );
};

export default ViewScreen;
