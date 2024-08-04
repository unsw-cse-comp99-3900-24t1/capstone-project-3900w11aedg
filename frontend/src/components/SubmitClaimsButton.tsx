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

const saveSuccessfulPresentations = async (domain: string, claims: [string, string][]) => {
  const existingPresentations = await AsyncStorage.getItem('successfulPresentations');
  const presentations = existingPresentations ? JSON.parse(existingPresentations) : [];

  const date = new Date();
  const formattedDate = formatDate(date) + ' ' + formatTime(date);

  const newPresentation = {
    serviceProvider: domain,
    date: formattedDate,
    claims: claims,
  };
  presentations.unshift(newPresentation);

  await AsyncStorage.setItem('successfulPresentations', JSON.stringify(presentations));
};

const mapClaimValues = (
  identifier: string | undefined,
  credentialSubject: { [key: string]: object | string },
  claims: { [key: string]: Set<string> }
): [string, string][] => {
  if (!identifier) {
    return [];
  }
  let claimsToMap = Object.entries(credentialSubject);
  if (identifier in claims) {
    claimsToMap = Object.entries(credentialSubject).filter(([key]) => claims[identifier]!.has(key));
  }
  return claimsToMap.map(([key, value]) => [
    key,
    typeof value === 'string' ? value : JSON.stringify(value),
  ]);
};

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
