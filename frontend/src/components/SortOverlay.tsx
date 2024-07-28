import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native';
import { Card } from '../config/types';
import sortFunction from '../helper/sorting';
import fetchData from '../helper/data.ts';

type Props = {
  setCards: (cards: Card[]) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setSortText: (text: string) => void;
};

const SortOverlay = ({ setCards, modalVisible, setModalVisible, setSortText }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [reverse, setReverse] = useState(false);

  const handleClose = async () => {
    await handleSort();
    setModalVisible(false);
  };

  const handleSort = async () => {
    const cards = await fetchData();
    if (selectedValue === null) {
      setSortText('Sort');
      const sortedCards = sortFunction(cards, 'issuanceDate');
      setCards(sortedCards);
      return;
    }
    let val = selectedValue;
    if (selectedValue?.endsWith('R')) {
      val = selectedValue.slice(0, -1);
    }
    setSortText(val);
    switch (val) {
      case 'Name':
        val = 'name';
        break;
      case 'Issued by':
        val = 'credIssuedBy';
        break;
      case 'Type':
        val = 'credType';
        break;
      case 'Issuance Date':
        val = 'issuanceDate';
        break;
      case 'Expiration Date':
        val = 'expiryDate';
        break;
      default:
        val = 'name';
        break;
    }
    const sortedCards = sortFunction(cards, val as keyof Card, reverse);
    setCards(sortedCards);
  };

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={handleClose}>
      <Pressable
        className="flex-1 justify-center items-center bg-dark-green opacity-80"
        onPress={handleClose}
      >
        <View className="absolute bottom-0 w-full">
          <View className="bg-navbar-grey flex flex-col justify-between pt-4 px-4 rounded-t-2xl">
            <Text className="text-lg text-white font-bold mb-3">Sort by</Text>
            <View // eslint-disable-next-line react-native/no-inline-styles
              style={{ borderBottomColor: 'white', borderBottomWidth: StyleSheet.hairlineWidth }}
              className="w-full mt-1 mb-2 mx-0 px-0"
            />
            <RadioButton
              label="Name (A -> Z)"
              value="name"
              selected={selectedValue === 'Name'}
              onSelect={() => {
                setSelectedValue('Name');
                setReverse(false);
              }}
            />
            <RadioButton
              label="Name (Z -> A)"
              value="name"
              selected={selectedValue === 'NameR'}
              onSelect={() => {
                setSelectedValue('NameR');
                setReverse(true);
              }}
            />
            <RadioButton
              label="Issuer (A -> Z)"
              value="Issuer"
              selected={selectedValue === 'Issued by'}
              onSelect={() => {
                setSelectedValue('Issued by');
                setReverse(false);
              }}
            />
            <RadioButton
              label="Type"
              value="Type"
              selected={selectedValue === 'Type'}
              onSelect={() => {
                setSelectedValue('Type');
                setReverse(false);
              }}
            />
            <RadioButton
              label="Issuance Date (oldest -> newest)"
              value="Issuance Date"
              selected={selectedValue === 'Creation DateR'}
              onSelect={() => {
                setSelectedValue('Creation DateR');
                setReverse(true);
              }}
            />
            <RadioButton
              label="Issuance Date (newest -> oldest)"
              value="Issuance Date"
              selected={selectedValue === 'Issuance Date'}
              onSelect={() => {
                setSelectedValue('Issuance Date');
                setReverse(false);
              }}
            />
            <RadioButton
              label="Expiry Date (closest -> latest)"
              value="Expiry Date"
              selected={selectedValue === 'Expiration DateR'}
              onSelect={() => {
                setSelectedValue('Expiration DateR');
                setReverse(true);
              }}
            />
            <RadioButton
              label="Expiry Date (latest -> closest)"
              value="Expiry Date"
              selected={selectedValue === 'Expiration Date'}
              onSelect={() => {
                setSelectedValue('Expiration Date');
                setReverse(false);
              }}
            />
            <View // eslint-disable-next-line react-native/no-inline-styles
              style={{
                borderBottomColor: 'white',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              className="w-full mt-1 mx-0 px-0"
            />
          </View>
          <View className="flex flex-row justify-between">
            <View className="flex-1 rounded-bl-3xl bg-navbar-grey">
              <TouchableOpacity onPress={() => setSelectedValue(null)}>
                <Text className="text-md p-3 text-white text-center">Reset</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 rounded-br-3xl bg-theme-gold">
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-md p-3 text-white text-center">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

type RProps = {
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
};

const RadioButton = ({ label, value, selected, onSelect }: RProps) => {
  return (
    <TouchableOpacity className="flex-row items-center mb-2" onPress={() => onSelect(value)}>
      {selected ? (
        <View className="h-3 w-3 border-4 border-theme-gold rounded-full" />
      ) : (
        <View className="h-3 w-3 border-2 border-white rounded-full white bg-none" />
      )}
      <Text className="ml-2 text-sm text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default SortOverlay;
