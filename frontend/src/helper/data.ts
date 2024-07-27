import AsyncStorage from '@react-native-async-storage/async-storage';
import Keychain from 'react-native-keychain';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options as never);
};

const fetchData = async () => {
  const keysString = await AsyncStorage.getItem('keys');
  const keys = JSON.parse(keysString ?? '[]');
  const dataPromises = keys.map(async (key: string, index: number) => {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (credentials) {
      const credentialsData = JSON.parse(credentials.password);
      const credentialSubject = credentialsData.credentialSubject;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const credentialSubjectArray: any[] = [];
      let i = 0;
      Object.keys(credentialSubject).forEach((subjectKey) => {
        credentialSubjectArray[i] = credentialSubject[subjectKey];
        i++;
      });
      return {
        id: index + 1,
        name: key,
        type: credentialsData.type[0],
        credIssuedBy: credentialsData.issuer,
        credType: credentialSubjectArray[1],
        credName: credentialSubjectArray[0],
        creationDate: formatDate(credentialsData.issuanceDate),
        expiryDate: formatDate(credentialsData.expirationDate),
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
