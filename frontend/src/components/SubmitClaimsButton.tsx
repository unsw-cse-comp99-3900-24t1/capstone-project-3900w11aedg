import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ClaimsRequest, VerifiableCredential } from '../config/types';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import { useNavigation } from '@react-navigation/native';
import { formatDate, formatTime } from '../helper/data.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    claimsToMap = Object.entries(credentialSubject).filter(([key]) => claims[identifier].has(key));
  }
  return claimsToMap.map(([key, value]) => [
    key,
    typeof value === 'string' ? value : JSON.stringify(value),
  ]);
};

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

      let claimsList: [string, string][] = [];
      claimsList = claimsList.concat(
        credentials.flatMap((credential) =>
          mapClaimValues(credential.identifier, credential.credentialSubject, claims)
        )
      );

      const claimsSet: Set<string> = new Set(claimsList.map((claim) => JSON.stringify(claim)));
      const uniqueClaimsList: [string, string][] = Array.from(claimsSet).map(
        (str) => JSON.parse(str) as [string, string]
      );

      await saveSuccessfulPresentations(claimsRequest.query.claims.id, uniqueClaimsList);
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
