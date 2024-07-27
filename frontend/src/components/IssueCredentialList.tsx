import { ScrollView, View, TouchableOpacity, Text, Alert } from 'react-native';
import React from 'react';
import { IssuerMetadata } from '../config/types';
import IssueCredential from './IssueCredential';
import axios from 'axios';
import AddedCredPopup from './AddedCredPopup';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  issuerMetadata: IssuerMetadata;
};

function IssueCredentialList({ issuerMetadata }: Props): JSX.Element {
  const [selectedCredential, setSelectedCredential] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const addCredential = async () => {
    try {
      const response = await axios.post('http://localhost:3000/credential/request', {
        credential_identifier: selectedCredential,
        authorization_endpoint: issuerMetadata.authorization_endpoint,
        credential_endpoint: issuerMetadata.credential_endpoint,
      });
      const keys = JSON.parse((await AsyncStorage.getItem('keys')) ?? '[]');
      keys.push(selectedCredential);
      await AsyncStorage.setItem('keys', JSON.stringify(keys));
      await Keychain.setGenericPassword(selectedCredential, JSON.stringify(response.data), {
        service: selectedCredential,
      });
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Sorry!', "We're having trouble processing this right now.");
    }
  };

  return (
    <View className="flex flex-col h-[60%]">
      <ScrollView>
        {Object.entries(issuerMetadata.credential_configurations_supported).map(([key, offer]) => (
          <IssueCredential
            key={key}
            credentialOffer={offer}
            backupName={key}
            isSelected={selectedCredential === key}
            onSelect={() => setSelectedCredential(key)}
          />
        ))}
      </ScrollView>

      <View>
        <TouchableOpacity
          className={`w-[35%] bg-theme-gold py-[3px] rounded-[8px] self-center mt-[30px] ${
            selectedCredential === '' ? 'opacity-30' : ''
          }`}
          disabled={selectedCredential === ''}
          onPress={addCredential}
        >
          <Text className="text-black text-lg font-medium text-center">Add</Text>
        </TouchableOpacity>
        {selectedCredential === '' && (
          <Text className="text-red-500 mt-[5px] text-center">Select a new credential to add.</Text>
        )}
      </View>
      <AddedCredPopup modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
}

export default IssueCredentialList;
