import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DeleteOverlay from '../components/DeleteOverlay';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Delete'>;
};

const DeleteAccountScreen = ({ navigation }: Props): JSX.Element => {
  const [text, setText] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-light-cream dark:bg-dark-green">
      <Header />
      <ScrollView className="flex flex-col px-[5%] h-[100%]">
        <TouchableOpacity
          className="w-[30%] bg-theme-gold py-[3px] rounded-[15px]"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black text-lg font-medium text-center">Back</Text>
        </TouchableOpacity>
        <View className="flex items-center pt-[20px] px-[5%]">
          <Text className="text-black dark:text-white text-3xl text-center font-bold">
            Delete Account
          </Text>
          <Text className="text-black dark:text-text-grey text-lg text-center pt-[5px]">
            All identifiers and credentials you own will be invalidated and removed.
          </Text>
          <View className="w-full shadow-inner-md bg-view-light dark:bg-card-dark-green flex items-center mt-[30px] py-[20px] rounded-[10px]">
            <Text className="text-white text-lg">Type "Delete my account" to confirm.</Text>
            <TextInput
              className="bg-white w-[90%] rounded-[10px] text-black my-[20px] text-center"
              onChangeText={setText}
              value={text}
            />
            <TouchableOpacity
              className={`p-[5px] rounded-[5px] p-[10px] ${
                text === 'Delete my account' ? 'bg-invalid-red' : 'bg-blurred-grey opacity-30'
              }`}
              disabled={text !== 'Delete my account'}
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white text-lg font-medium">Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <DeleteOverlay modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <Footer />
    </View>
  );
};

export default DeleteAccountScreen;
