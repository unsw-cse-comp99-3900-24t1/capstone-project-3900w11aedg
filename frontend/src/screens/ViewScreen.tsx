import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RootStackParamList } from '../config/types.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Keychain from 'react-native-keychain';
import OverlayComponent from '../components/OverlayComponent.tsx';
import ViewCredentialDetails from '../components/ViewCredentialDetails.tsx';
import ViewCredentialOperations from '../components/ViewCredentialOperations.tsx';

type Props = {
  route: RouteProp<RootStackParamList, 'View'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'View'>;
};

const ViewScreen = ({ route, navigation }: Props): React.ReactElement => {
  const { card } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  const handleRemoveConfirmation = async (key: string) => {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      console.log('Failed to remove credentials:');
    }
    setModalVisible(false);
    navigation.navigate('Home');
  };

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(card.expiryDate) < new Date(new Date().getTime() + offset);

  return (
    <View className="w-[100%] flex-1 bg-white dark:bg-dark-green">
      <Header />
      <ScrollView className="mb-20">
        <View className="px-12 py-5">
          <Pressable
            onPress={() => navigation.navigate('Home')}
            className="w-[27%] bg-theme-gold p-2 rounded-3xl "
          >
            <Text className="font-medium text-black text-center text-base">Done</Text>
          </Pressable>
        </View>
        <View className="h-[65%] w-[80%] mx-auto flex flex-col">
          <ViewCredentialDetails card={card} isExpired={isExpired} />
          <ViewCredentialOperations
            card={card}
            isExpired={isExpired}
            setModalVisible={setModalVisible}
          />
        </View>
      </ScrollView>
      <Footer />
      <OverlayComponent
        modalVisible={modalVisible}
        handleClose={() => setModalVisible(false)}
        title="Do you wish to permanently remove this credential from your wallet?"
        description="If you wish to use this credential again, you will have to have it reissued from your issuer."
        leftOption="Cancel"
        handleDelete={() => handleRemoveConfirmation(card.originalName)}
        rightOption="Delete"
      />
    </View>
  );
};

export default ViewScreen;
