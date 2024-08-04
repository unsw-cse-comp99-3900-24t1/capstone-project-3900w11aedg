import { formatDate, formatTime } from '../helper/data.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ClaimsRequest, VerifiableCredential, RootStackParamList } from '../config/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RequestBody = {
  credentials: (VerifiableCredential & { identifier?: string })[];
  serviceProviderUrl: string;
  claimsToKeep?: { [key: string]: string[] };
};

const saveSuccessfulPresentations = async (
  domain: string,
  claims: [string, string][]
): Promise<void> => {
  const existingPresentations = await AsyncStorage.getItem('successfulPresentations');
  const presentations = existingPresentations ? JSON.parse(existingPresentations) : [];

  const date = new Date().toDateString();
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
  const claimsToKeep = identifier in claims ? claims[identifier] : null;
  if (claimsToKeep) {
    claimsToMap = Object.entries(credentialSubject).filter(([key]) => claimsToKeep.has(key));
  }
  return claimsToMap.map(([key, value]) => [
    key,
    typeof value === 'string' ? value : JSON.stringify(value),
  ]);
};

export const handleSubmission = async (
  claimsRequest: ClaimsRequest,
  claims: { [key: string]: Set<string> },
  credentials: (VerifiableCredential & { identifier?: string })[],
  navigation: NativeStackNavigationProp<RootStackParamList>
): Promise<void> => {
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
