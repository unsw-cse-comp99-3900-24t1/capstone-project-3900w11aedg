import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { CredentialOffer } from '../config/types';
import IssueCredential from './IssueCredential';

type Props = {
  credentialOffers: keyof { [key: string]: CredentialOffer };
};

export default function IssueCredentialList({ credentialOffers }: Props): JSX.Element {
  const [selectedCredential, setSelectedCredential] = React.useState('');
  const addCredential = () => {
    console.log('added credential');
  };

  return (
    <View>
      <ScrollView>
        {Object.entries(credentialOffers).map(([key, offer]) => (
          <IssueCredential
            key={key}
            credentialOffer={offer}
            isSelected={selectedCredential === key}
            onSelect={() => setSelectedCredential(key)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        className="w-[35%] bg-theme-gold py-[3px] rounded-[8px] self-center mt-[30px]"
        onPress={addCredential}
      >
        <Text className="text-black text-lg font-medium text-center">Add</Text>
      </TouchableOpacity>
    </View>
  );
}
