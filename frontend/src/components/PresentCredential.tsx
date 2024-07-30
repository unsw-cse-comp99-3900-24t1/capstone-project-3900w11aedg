import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ExpiryStatusLabel from './ExpiryStatusLabel';
import { Card } from '../config/types';
import ClaimCheckbox from './ClaimCheckbox';

type Props = {
  credential: Card;
  addClaims: (claim: string, isAdding: boolean, id: string) => void;
};

function PresentCredential({ credential, addClaims }: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const icon = open
    ? require('../assets/upwards_arrow.png')
    : require('../assets/downwards_arrow.png');

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(credential.expiryDate) < new Date(new Date().getTime() + offset);
  const gradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];

  return (
    <View className="flex items-center">
      <LinearGradient colors={gradientColour} className="rounded-xl mt-[10px] w-full">
        <View className="flex flex-row justify-between min-h-[110px] rounded-md p-[15px]">
          <View className="w-20">
            <Text className="w-80 mb-10 text-white text-2xl font-medium">{credential.name}</Text>
            <ExpiryStatusLabel isExpired={isExpired} />
          </View>
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            disabled={isExpired}
            className="ml-auto mt-auto items-end"
          >
            <Image
              source={isExpired ? require('../assets/disabled_dropdown.png') : icon}
              resizeMode="contain"
              className="w-[25px] h-[25px] mr-2"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View
        className={`w-[90%] bg-dropdown-grey-100 p-[3%] rounded-b-md ${open ? 'block' : 'hidden'}`}
      >
        <View className="bg-dropdown-grey-200 rounded-md p-[3%]">
          {Object.entries(credential.claims).map(([key, claim]) => (
            <View key={key} className="flex flex-row justify-between">
              <View className="w-[75%]">
                <Text className="text-white text-lg font-medium">{key}</Text>
                <Text>{claim}</Text>
              </View>
              <ClaimCheckbox id={credential.id} claim={key} addClaims={addClaims} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default PresentCredential;
