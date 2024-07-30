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
interface IProps {
  card: Card;
}

type ViewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'View'>;

const IdentityCard: React.FC<IProps> = ({ card }) => {
  const navigation = useNavigation<ViewScreenNavigationProp>();

  const handleCardPress = () => {
    navigation.navigate('View', { card });
  };

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(card.expiryDate) < new Date(new Date().getTime() + offset);
  const formattedExpiryDate = formatDate(card.expiryDate);
  const darkGradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];
  const lightGradientColour = isExpired ? ['#c2d6ba', '#8da883'] : ['#8da883', '#c2d6ba'];

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
        <View className="w-80 min-h-[225px] rounded-md">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-2xl font-bold pt-4 px-4 text-text-black dark:text-white">
                {card.name}
              </Text>
              <Text className="text-md px-4 pb-6 text-text-black dark:text-white">
                {Object.keys(card.claims).length} claims
              </Text>
            </Pressable>
            <View className="w-10 h-10 p-2 mt-3 mr-10 flex flex-row gap-x-1">
              <PinButton card={card} />
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable onPress={handleCardPress} className="flex-1">
            <View className="flex-1 p-4 justify-end">
              <View className="flex-row justify-between items-center">
                <Text className=" font-bold text-lg text-text-black dark:text-white">
                  {card.type}
                </Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <LinearGradient colors={usedGradient} className="rounded-xl  text-text-black dark:text-white">
        <View className="min-h-[225px] w-80 pb-6 mx-auto rounded-md overflow-hidden">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-2xl font-bold px-4 pb-0 pt-4 text-text-black dark:text-white">
                {card.name}
              </Text>
            </Pressable>
            <View className="w-10 h-10 p-2 mt-3 mr-10 flex flex-row gap-x-1">
              <PinButton card={card} />
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full scale-x-[-1]"
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable className="mt-auto" onPress={handleCardPress}>
            <Text className="text-lg mx-2 px-4 text-text-black dark:text-white font-bold">
              Issue Date: <Text className="font-normal">{formattedExpiryDate}</Text>
            </Text>
            <Text className="text-lg mx-2 mt-auto font-bold text-text-black dark:text-white px-4">
              Expiry Date: <Text className="font-normal">{formattedExpiryDate}</Text>
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </FlipCard>
  );
};

export default IdentityCard;
