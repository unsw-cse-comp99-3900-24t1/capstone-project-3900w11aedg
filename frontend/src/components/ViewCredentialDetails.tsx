import { View, Text, Appearance } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ExpiryStatusLabel from '../components/ExpiryStatusLabel';
import { Card } from '../config/types';

type Props = {
  card: Card;
  isExpired: boolean;
};

const ViewCredentialDetails = ({ card, isExpired }: Props): JSX.Element => {
  // Format gradient background based on expiry date of credential
  const formattedExpiryDate = new Date(card.expiryDate).toDateString().toString();
  const darkGradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];
  const lightGradientColour = isExpired ? ['#c2d6ba', '#8da883'] : ['#8da883', '#c2d6ba'];

  const [currColorScheme, setColorScheme] = React.useState(Appearance.getColorScheme());

  const getGradientColors = () => {
    return currColorScheme === 'light' ? lightGradientColour : darkGradientColour;
  };

  const usedGradient = getGradientColors();

  React.useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return (
    <LinearGradient colors={usedGradient} className="rounded-2xl text-text-black dark:text-white">
      <View className="min-h-[200px] w-80 rounded-md overflow-hidden p-4">
        <Text className="text-2xl text-text-black dark:text-white font-bold p-4">{card.name}</Text>
        {card.description && card.description.length > 0 && (
          <Text className="text-base text-text-black dark:text-white my-2 px-4">
            {card.description}
          </Text>
        )}
        <View className="flex-1 px-2 py-4 justify-end">
          <Text className="pb-1 text-text-black dark:text-white  font-bold text-xl">
            {card.type}
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-text-black dark:text-white  text-lg mr-2">
              Expiry:
              <Text className="text-text-black dark:text-white text-md font-bold">
                {' ' + formattedExpiryDate}
              </Text>
            </Text>
            <ExpiryStatusLabel isExpired={isExpired} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ViewCredentialDetails;
