import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ClaimsRequest, VerifiableCredential, RootStackParamList } from '../config/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { handleSubmission } from '../helper/submit_claims';

export type SubmitClaimsButtonProps = {
  claimsRequest: ClaimsRequest;
  claims: { [key: string]: Set<string> };
  credentials: (VerifiableCredential & { identifier?: string })[];
};

type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const SubmitClaimsButton: React.FC<SubmitClaimsButtonProps> = ({
  claimsRequest,
  claims,
  credentials,
}) => {
  const navigation = useNavigation<NavProps>();

  return (
    <TouchableOpacity
      className="bg-theme-gold w-[35%] p-[5px] rounded-[5px]"
      onPress={() => handleSubmission(claimsRequest, claims, credentials, navigation)}
    >
      <Text className="text-black text-lg font-medium text-center">Share</Text>
    </TouchableOpacity>
  );
};

export default SubmitClaimsButton;
