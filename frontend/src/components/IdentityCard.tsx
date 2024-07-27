import React from 'react';
import { Image, View, Text, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ExpiryStatusLabel from './ExpiryStatusLabel';

interface IProps {
  card: {
    name: string;
    type: string;
    credIssuedBy: string;
    credType: string;
    credName: string;
    creationDate: string;
    expiryDate: string;
  };
}

const IdentityCard: React.FC<IProps> = ({ card }) => {
  const navigation = useNavigation();

  const handleCardPress = () => {
    navigation.navigate('View', { card });
  };

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(card.expiryDate) < new Date(new Date().getTime() + offset);

  const gradientColour = isExpired ? ['#606665', '#606665'] : ['#1F2A29', '#527E78'];
  const formattedExpiryDate = new Date(card.expiryDate).toDateString().toString();

  return (
    <FlipCard>
      <LinearGradient colors={gradientColour} className="rounded-md">
        <View className="h-40 w-80 rounded-md overflow-hidden">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-xl text-white font-bold p-4">{card.name}</Text>
            </Pressable>
            <View className="w-12 h-14 p-1">
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable onPress={handleCardPress} className="flex-1">
            <View className="flex-1 p-4 justify-end">
              <Text className="text-white font-bold text-base">{card.type}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-base">
                  Expiry: <Text className="font-bold">{formattedExpiryDate}</Text>
                </Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <LinearGradient colors={gradientColour} className="rounded-md">
        <View className="h-40 w-80 rounded-md overflow-hidden">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-xl text-white font-bold p-4">{card.name}</Text>
            </Pressable>
            <View className="w-12 h-14 p-1">
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
          <Text className="pl-4 text-white">{card.credIssuedBy}</Text>
          <Pressable onPress={handleCardPress} className="p-2">
            <View className="flex-row justify-between">
              <View className="ml-2">
                <Text />
                <Text className="text-white">Type</Text>
              </View>
              <View className="overflow-hidden">
                <Text className="text-white font-bold">{card.credName}</Text>
                <Text className="text-white font-bold">{card.credType}</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    </FlipCard>
  );
};

export default IdentityCard;
