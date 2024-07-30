import Keychain from 'react-native-keychain';
import { Card } from '../config/types.ts';
import normaliseCredential from './normalise.ts';

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options as never);
};

const fetchData = async (): Promise<Card[]> => {
  const keys = await Keychain.getAllGenericPasswordServices();
  const dataPromises = keys.map(async (key: string) => {
    const credentials = await Keychain.getGenericPassword({ service: key });
    if (credentials) {
      return normaliseCredential(key, credentials.password);
    } else {
      console.log(`No data found for key ${key}`);
      return null;
    }
  });
  const data = await Promise.all(dataPromises);
  return data.filter((item) => item !== null);
};

export default fetchData;
