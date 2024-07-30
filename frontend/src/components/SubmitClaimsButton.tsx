import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ClaimsRequest, VerifiableCredential } from '../config/types';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';

type Props = {
  claimsRequest: ClaimsRequest;
  claims: { [key: string]: Set<string> };
  credentials: (VerifiableCredential & { identifier?: string })[];
};

type RequestBody = {
  credentials: (VerifiableCredential & { identifier?: string })[];
  serviceProviderUrl: string;
  claimsToKeep?: { [key: string]: string[] };
};
type NavProps = NativeStackNavigationProp<RootStackParamList>;

function SubmitClaimsButton({ claimsRequest, claims, credentials }: Props): JSX.Element {
  const navigation = useNavigation<NavProps>();
  const handleSubmission = async () => {
    try {
      const body: RequestBody = {
        credentials,
        serviceProviderUrl: claimsRequest.query.url,
      };
      const claimsUpdated: { [key: string]: string[] } = {};
      Object.keys(claims).forEach((key) => {
        claimsUpdated[key] = Array.from(claims[key] as Set<string>);
      });
      body.claimsToKeep = claimsUpdated;
      const response = await axios.post('http://localhost:3000/presentation/create', body);
      navigation.navigate('Verified', { success: response.data.verified });
    } catch (error) {
      navigation.navigate('Verified', { success: false });
    }
  };
  return (
    <TouchableOpacity
      className="bg-theme-gold w-[35%] p-[5px] rounded-[5px]"
      onPress={handleSubmission}
    >
      <Text className="text-black text-lg font-medium text-center">Share</Text>
    </TouchableOpacity>
  );
}

export default SubmitClaimsButton;
