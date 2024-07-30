import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ExpiryStatusLabel from './ExpiryStatusLabel';
import { Card, VerifiableCredential } from '../config/types';
import ClaimCheckbox from './ClaimCheckbox';

type Props = {
  credential: Card;
  addClaims: (claim: string, isAdding: boolean, id: string) => void;
  claimsObject: { [key: string]: Set<string> };
  chosenCredentials: VerifiableCredential[];
  chooseCredential: (credentialsRequest: VerifiableCredential) => void;
  verifiableCredential: VerifiableCredential;
};

function PresentCredential({
  credential,
  addClaims,
  claimsObject,
  chosenCredentials,
  chooseCredential,
  verifiableCredential,
}: Props): JSX.Element {
  const [isSelected, setIsSelected] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const icon = open
    ? require('../assets/upwards_arrow.png')
    : require('../assets/downwards_arrow.png');

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(credential.expiryDate) < new Date(new Date().getTime() + offset);
  const gradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];

  const handleSelection = () => {
    chooseCredential(verifiableCredential);
    setIsSelected(!isSelected);
  };
  const handleSelectionByClaim = (addingClaim: boolean) => {
    if (addingClaim && !chosenCredentials.includes(verifiableCredential)) {
      chooseCredential(verifiableCredential);
      setIsSelected(!isSelected);
    }
  };

  return (
    <View className="flex items-center">
      <LinearGradient
        colors={gradientColour}
        className={`rounded-xl mt-[10px] w-full ${
          isSelected ? 'border-[2px] border-theme-gold' : ''
        }`}
      >
        <View className="flex flex-row justify-between w-full min-h-[110px] w-80 rounded-md p-[15px]">
          <TouchableOpacity onPress={handleSelection}>
            <View className="flex flex-col justify-between w-[80%]">
              <Text className="text-white text-2xl font-medium">{credential.name}</Text>
              <ExpiryStatusLabel isExpired={isExpired} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            disabled={isExpired}
            className="flex justify-end items-end w-[20%]"
          >
            <Image
              source={isExpired ? require('../assets/disabled_dropdown.png') : icon}
              resizeMode="contain"
              className="w-[25px] h-[25px]"
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
              <ClaimCheckbox
                claimsObject={claimsObject}
                id={credential.id}
                claim={key}
                addClaims={addClaims}
                handleSelectionByClaim={handleSelectionByClaim}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default PresentCredential;
