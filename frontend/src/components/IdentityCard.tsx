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
    credNumber: string;
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
        <View className="h-40 w-80 rounded-md">
          <View className="flex-1 flex-row justify-between p-4">
            <Text className="text-lg text-white font-bold mb-2">{card.name}</Text>
            <View className="w-7 h-7">
              <Image
                source={require('../assets/fliparrow.png')}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
          <Pressable onPress={handleCardPress}>
            <View className="p-4">
              <Text className="text-white font-bold ">{card.type}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-white">
                  Expiry <Text className="font-bold">{formattedExpiryDate}</Text>
                </Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </Pressable>
        </View>
      </LinearGradient>
      <View className="h-40 w-80 bg-card-grey rounded-md">
        <View className="flex-1 flex-row justify-between p-4">
          <Text className="text-lg font-bold mb-2">{card.name}</Text>
          <View className="w-7">
            <Image
              source={require('../assets/fliparrow.png')}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>
        <Text className="pl-4">{card.credIssuedBy}</Text>
        <Pressable onPress={handleCardPress}>
          <View className="flex-row pt-1 px-10 justify-around">
            <View>
              <Text>Name</Text>
              <Text> No.</Text>
              <Text>Type</Text>
            </View>
            <View>
              <Text>{card.credName}</Text>
              <Text>{card.credNumber}</Text>
              <Text>{card.credType}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </FlipCard>
  );
};

export default IdentityCard;
