import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ClaimsRequest, VerifiableCredential } from '../config/types';
import axios, { AxiosError } from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';

type Props = {
  claimsRequest: ClaimsRequest;
  claims: ClaimsObject;
  credentials: VerifiableCredential[];
};

type ClaimsObject = {
  [key: string]: string[];
};

type RequestBody = {
  credentials: VerifiableCredential[];
  serviceProviderUrl: string;
  claimsToKeep?: ClaimsObject;
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
      if (claims) {
        body.claimsToKeep = claims;
      }
      const response = await axios.post('http://localhost:3000/presentation/create', body);
      navigation.navigate('Verified', { success: response.data.verified });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 500) {
        navigation.navigate('Verified', { success: false });
      }
      console.log(error);
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
