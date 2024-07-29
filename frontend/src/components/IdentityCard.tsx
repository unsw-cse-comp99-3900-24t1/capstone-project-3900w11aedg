import React from 'react';
import { Image, View, Text, Pressable, StyleSheet } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Card } from '../config/types';
import ExpiryStatusLabel from './ExpiryStatusLabel';
import { formatDate } from '../helper/data.ts';
import { normaliseKey, normaliseURL } from '../helper/normalise.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
interface IProps {
  card: Card;
}

const styles = StyleSheet.create({
  minHeight: {
    minHeight: 160,
  },
});

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
        <View style={styles.minHeight} className="w-80 rounded-md">
          <View className="flex-row justify-between">
            <Pressable onPress={handleCardPress} className="flex-1">
              <Text className="text-2xl text-white font-bold pt-4 px-4">{card.name}</Text>
              {card.description.length > 0 && (
                <Text className="text-md text-white px-4 py-2">{card.description}</Text>
              )}
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
            <View className="flex-1 p-4 justify-end">
              <Text className="text-white font-bold text-lg">{card.type}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-white text-lg">
                  Expiry: <Text className="font-bold">{formattedExpiryDate}</Text>
                </Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </Pressable>
        </View>
      </LinearGradient>

      <LinearGradient colors={gradientColour} className="rounded-xl">
        <View style={styles.minHeight} className="w-80 pb-6 mx-auto rounded-md overflow-hidden">
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
          <Pressable onPress={handleCardPress} className="mx-4 pt-2">
            <View className="mb-2 flex flex-row">
              <Text className="font-bold text-base text-white">Issued by: </Text>
              <Text className="text-white text-base">{normaliseURL(card.credIssuedBy)}</Text>
            </View>
            <View className="flex flex-col content-center">
              {Object.keys(card.claims).map((key, index) => (
                <View className="content-center" key={index}>
                  <Text className="text-white font-bold text-base">{normaliseKey(key)}</Text>
                  <Text className="text-white text-md">{card.claims[key]}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    </FlipCard>
  );
};

export default IdentityCard;
