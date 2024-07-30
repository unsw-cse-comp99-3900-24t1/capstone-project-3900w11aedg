import { Card, VerifiableCredential } from '../config/types.ts';
import Keychain from 'react-native-keychain';

const pinCard = async (card: Card) => {
  try {
    const credential = await Keychain.getGenericPassword({ service: card.originalName });
    const JSONCredential = JSON.parse(credential.password) as VerifiableCredential;
    const date = Date.now();
    JSONCredential.pinned = JSONCredential.pinned ? null : date;
    await Keychain.setGenericPassword(card.originalName, JSON.stringify(JSONCredential), {
      service: card.originalName,
    });
  } catch (error) {
    console.error('Could not pin card:', error);
  }
};

export default pinCard;
