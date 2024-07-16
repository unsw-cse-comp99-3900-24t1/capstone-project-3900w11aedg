import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';

type RootStackParamList = {
  ViewScreen: {
    card: {
      id: number;
      creationDate: string;
      expiryDate: string;
      name: string;
      type: string;
      credIssuedBy: string;
      credNumber: string;
      credType: string;
      credName: string;
    };
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

  return (
    <View className="w-[100%] flex-1 bg-white dark:bg-dark-green">
      <Header />
      <View className="px-12 py-5">
        <Pressable onPress={handleButtonPress} className="w-[20%] bg-theme-gold p-1.5 rounded-3xl ">
          <Text className="font-medium text-black text-center">Done</Text>
        </Pressable>
      </View>
      <View className="h-[65%] flex items-center space-y-5">
        <View className="h-40 w-[75%] bg-card-green rounded-2xl">
          <View className="flex-1 flex-row justify-between p-4">
            <Text className="text-lg font-bold mb-2">{card.name}</Text>
          </View>
          <View className="h-20 pl-5">
            <Text className="text-white">{card.type}</Text>
          </View>
        </View>
        <View className="w-[90%] bg-card-view-grey rounded-2xl space-y-5 p-5">
          <View className="p-3 bg-popup-grey rounded-lg justify-around">
            <Text className="text-white font-bold">Pin to Wallet</Text>
          </View>
          <View className="w-[100%] bg-popup-grey rounded-lg flex-row p-3 space-x-5 rounded-2xl">
            <View>
              <Text className="text-white font-medium">Issued By</Text>
              <Text className="text-white font-medium">Created</Text>
              <Text className="text-white font-medium">Expiry</Text>
            </View>
            <View>
              <Text className="text-grey">{card.credIssuedBy}</Text>
              <Text className="text-grey">{card.creationDate}</Text>
              <Text className="text-grey">{card.expiryDate}</Text>
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
