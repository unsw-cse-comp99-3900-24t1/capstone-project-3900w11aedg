import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ClaimsRequest, VerifiableCredential } from '../config/types';
import axios, { AxiosError } from 'axios';
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

const saveSuccessfulPresentations = async (domain: string, claims: string[]) => {
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
  identifier: string,
  claims: string[],
  credentials: VerifiableCredential & { identifier: string }
) => {
  const credentialSubject = Object.entries(
    credentials.filter(credential => credential.identifier === identifier)[0].credentialSubject
  );

  return claims.reduce((acc, claim) => {
    acc.push([claim, credentialSubject.find((subject) => subject[0] === claim)[1]]);
    return acc;
  }, []);
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

      let claimsList = [];
      claimsList = claimsList.concat(Object.entries(claims)
        .map(([identifier, claim]) => mapClaimValues(identifier, Array.from(claim), credentials))).flat();
      await saveSuccessfulPresentations(claimsRequest.query.domain, claimsList);

    } catch (error) {
      if (
        (error instanceof AxiosError && error.response?.status === 500) ||
        (error instanceof AxiosError && error.response?.status === 400)
      ) {
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
