import React from 'react';
import { Image, View, Text, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../config/types';
import ExpiryStatusLabel from './ExpiryStatusLabel';
import { formatDate } from '../helper/data.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
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
  const gradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];
  const formattedExpiryDate = formatDate(card.expiryDate);

  return (
    <FlipCard>
      <LinearGradient colors={gradientColour} className="rounded-xl">
        <View className="w-80 min-h-[200px] rounded-md">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-2xl text-white font-bold pt-4 px-4">{card.name}</Text>
              <Text className="text-md text-white px-4 pb-6">
                {Object.keys(card.claims).length} claims
              </Text>
            </Pressable>
            <View className="w-12 h-14 p-2 mr-4">
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable onPress={handleCardPress} className="flex-1">
            <View className="flex-1 px-4 pb-4 justify-end">
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-bold text-xl">{card.type}</Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <LinearGradient colors={gradientColour} className="rounded-xl">
        <View className="min-h-[225px] w-80 pb-4 mx-auto rounded-md overflow-hidden">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-2xl text-white font-bold px-4 pb-0 pt-4">{card.name}</Text>
            </Pressable>
            <View className="w-12 h-14 p-2 mr-4">
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable className="mt-auto" onPress={handleCardPress}>
            <Text className="text-lg mx-2 text-white px-4 font-bold">
              Issue Date: <Text className="font-normal">{formattedExpiryDate}</Text>
            </Text>
            <Text className="text-lg mx-2 mt-auto text-white font-bold px-4">
              Expiry Date: <Text className="font-normal">{formattedExpiryDate}</Text>
            </Text>
          </Pressable>
          <Pressable onPress={handleCardPress} className="mx-4 pt-2" />
        </View>
      </LinearGradient>
    </FlipCard>
  );
};

export default IdentityCard;
