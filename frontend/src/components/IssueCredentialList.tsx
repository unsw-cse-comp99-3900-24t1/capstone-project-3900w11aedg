import { ScrollView, View, TouchableOpacity, Text, Alert, Image } from 'react-native';
import React from 'react';
import { IssuerMetadata, VerifiableCredential } from '../config/types';
import IssueCredential from './IssueCredential';
import axios from 'axios';
import AddedCredPopup from './AddedCredPopup';
import * as Keychain from 'react-native-keychain';

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
      const credential = response.data.credential as VerifiableCredential & { identifier?: string };
      credential.identifier = response.data.identifier;

      await Keychain.setGenericPassword(selectedCredential, JSON.stringify(credential), {
        service: selectedCredential,
      });
      setModalVisible(true);
    } catch (error) {
      Alert.alert('Sorry!', "We're having trouble processing this right now.");
      console.log(error);
    }
  };

  const displayImageURL = issuerMetadata.display?.logo?.uri;

  return (
    <View className="flex flex-col h-[70%]">
      <ScrollView className="mb-4">
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

      <View className="">
        <Text className={'pb-4 text-xl font-bold text-center'}>Issuer</Text>
        <Image
          source={{ uri: displayImageURL }}
          className="w-[40%] h-[40%] self-center"
          resizeMode="contain"
        />
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
