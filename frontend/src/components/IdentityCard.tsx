import React, { useEffect, useState } from 'react';
import { Image, View, Text, Pressable, Appearance } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../config/types';
import ExpiryStatusLabel from './ExpiryStatusLabel';
import { formatDate } from '../helper/data.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import PinButton from './PinButton.tsx';

type Props = {
  card: Card;
};

type ViewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'View'>;

const IdentityCard = ({ card }: Props): JSX.Element => {
  const navigation = useNavigation<ViewScreenNavigationProp>();

  const handleCardPress = () => {
    navigation.navigate('View', { card });
  };

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(card.expiryDate) < new Date(new Date().getTime() + offset);
  const formattedExpiryDate = formatDate(card.expiryDate);
  const formattedIssueDate = formatDate(card.issuanceDate);
  const darkGradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];
  const lightGradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#8da883', '#c2d6ba'];

  const [currColorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const getGradientColors = () => {
    return currColorScheme === 'light' ? lightGradientColour : darkGradientColour;
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const usedGradient = getGradientColors();

  return (
    <FlipCard>
      <LinearGradient colors={usedGradient} className="rounded-xl text-text-black dark:text-white">
        <View className="w-80 min-h-[200px] rounded-md">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text
                className={`text-2xl font-bold ${
                  isExpired ? 'text-white dark:text-text-black' : 'text-text-black dark:text-white'
                } pt-4 px-6 pb-1`}
              >
                {card.name}
              </Text>
            </Pressable>
            <View className="w-10 h-10 p-2 mt-3 mr-12 flex flex-row gap-x-2">
              <PinButton isExpired={isExpired} card={card} />
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                tintColor={isExpired ? 'black' : 'white'}
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable onPress={handleCardPress} className="flex-1 flex flex-row">
            <Text
              className={`text-lg flex-1 ${
                isExpired ? 'text-white dark:text-text-black' : 'text-text-black dark:text-white'
              } mt-auto mx-6 pb-4`}
            >
              {Object.keys(card.claims).length} claims
            </Text>
            <View
              className={`pb-4 ${isExpired ? 'w-[90px]' : 'w-[70px]'} ml-auto mx-6 justify-end`}
            >
              <ExpiryStatusLabel isExpired={isExpired} />
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <LinearGradient colors={usedGradient} className="rounded-xl  text-text-black dark:text-white">
        <View className="min-h-[200px] w-80 pb-6 mx-auto rounded-md overflow-hidden">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text
                className={`text-2xl font-bold ${
                  isExpired ? 'text-white dark:text-text-black' : 'text-text-black dark:text-white'
                } px-6 pb-0 pt-4`}
              >
                {card.name}
              </Text>
            </Pressable>
            <View className="w-10 h-10 p-2 mt-3 mr-12 flex flex-row gap-x-2">
              <PinButton isExpired={isExpired} card={card} />
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full scale-x-[-1]"
                resizeMode="contain"
                tintColor={isExpired ? 'black' : 'white'}
              />
            </View>
          </View>
          <Pressable className="mt-auto" onPress={handleCardPress}>
            <Text
              className={`text-xl mx-2 px-4 ${
                isExpired ? 'text-white dark:text-text-black' : 'text-text-black dark:text-white'
              } font-bold`}
            >
              {card.type}
            </Text>
            <Text
              className={`text-lg mx-2 px-4 ${
                isExpired ? 'text-white dark:text-text-black' : 'text-text-black dark:text-white'
              } font-bold`}
            >
              Issue Date: <Text className="font-normal">{formattedIssueDate}</Text>
            </Text>
            <Text
              className={`text-lg mx-2 px-4 ${
                isExpired ? 'text-white dark:text-text-black' : 'text-text-black dark:text-white'
              } font-bold`}
            >
              Expiry Date: <Text className="font-normal">{formattedExpiryDate}</Text>
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </FlipCard>
  );
};

export default IdentityCard;
