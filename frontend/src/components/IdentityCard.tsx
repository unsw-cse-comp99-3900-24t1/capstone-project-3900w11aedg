import React from 'react';
import { Image, View, Text, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { useNavigation } from '@react-navigation/native';

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

  return (
    <FlipCard>
      <View className="h-40 w-80 bg-card-green rounded-md">
        <View className="flex-1 flex-row justify-between p-4">
          <Text className="text-lg font-bold mb-2">{card.name}</Text>
          <View className="w-7 h-7">
            <Image
              source={require('../assets/fliparrow.png')}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
        </View>
        <Pressable onPress={handleCardPress}>
          <View className="h-20 pl-5">
            <Text className="text-white">{card.type}</Text>
          </View>
        </Pressable>
      </View>
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
