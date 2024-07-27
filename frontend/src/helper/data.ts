import AsyncStorage from '@react-native-async-storage/async-storage';
import Keychain from 'react-native-keychain';

const fetchData = async () => {
  const keysString = await AsyncStorage.getItem('keys');
  const keys = JSON.parse(keysString ?? '[]');
  const dataPromises = keys.map(async (key: string, index: number) => {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (credentials) {
      const credentialsData = JSON.parse(credentials.password);
      const credentialSubject = credentialsData.credentialSubject;

      return {
        id: index + 1,
        name: key,
        type: credentialsData.type,
        credIssuedBy: credentialsData.issuer,
        credNumber: '34839',
        credType: credentialSubject.degree,
        credName: 'jamie boss',
        creationDate: credentialsData.issuanceDate,
        expiryDate: credentialsData.expirationDate,
      };
    } else {
      console.log(`No data found for key ${key}`);
      return null;
    }
  });
  const data = await Promise.all(dataPromises);
  return data.filter((item) => item !== null);
};

export default fetchData;
