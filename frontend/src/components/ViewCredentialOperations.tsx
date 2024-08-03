import React from 'react';
import { View, Text, Pressable, TouchableOpacity, Alert } from 'react-native';
import { formatDate } from '../helper/data.ts';
import { normaliseKey, normaliseURL } from '../helper/normalise.ts';
import PinButton from '../components/PinButton.tsx';
import { Card } from '../config/types.ts';

type Props = {
  card: Card;
  isExpired: boolean;
  setModalVisible: (visible: boolean) => void;
};

const ViewCredentialOperations = ({ card, isExpired, setModalVisible }: Props): JSX.Element => {
  return (
    <View className="mx-auto bg-card-view-grey rounded-2xl space-y-5 w-[100%] p-5 mt-5">
      <View className="p-3 bg-view-light dark:bg-popup-grey rounded-lg justify-around">
        <PinButton
          card={card}
          isExpired={isExpired}
          additionalElements={
            <Text className="text-text-black dark:text-white font-bold ml-1">Pin to Wallet</Text>
          }
        />
      </View>
      <View className="w-[100%] bg-popup-grey flex-row p-3 space-x-5 rounded-2xl">
        <View>
          <Text numberOfLines={1} className=" text-text-black dark:text-white font-medium">
            Issued by
          </Text>
          <Text numberOfLines={1} className=" text-text-black dark:text-white font-medium">
            Issued at
          </Text>
          <Text numberOfLines={1} className="text-black dark:text-white font-medium">
            Expiry
          </Text>
          {Object.keys(card.claims).map((key, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                Alert.alert(normaliseKey(key));
              }}
            >
              <Text key={index} numberOfLines={1} className="text-black dark:text-white">
                {normaliseKey(key)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(card.credIssuedBy);
            }}
          >
            <Text numberOfLines={1} className="text-white">
              {normaliseURL(card.credIssuedBy)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert(card.issuanceDate)}>
            <Text numberOfLines={1} className="text-white">
              {formatDate(card.issuanceDate)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert(card.expiryDate)}>
            <Text numberOfLines={1} className="text-white">
              {formatDate(card.expiryDate)}
            </Text>
          </TouchableOpacity>
          {Object.values(card.claims).map((value, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                Alert.alert(value);
              }}
            >
              <Text key={index} numberOfLines={1} className="text-white">
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Pressable onPress={() => setModalVisible(true)}>
        <View className="p-3 bg-view-light dark:bg-popup-grey rounded-lg justify-around">
          <Text className="text-red-500 font-bold">Remove Credential</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ViewCredentialOperations;
