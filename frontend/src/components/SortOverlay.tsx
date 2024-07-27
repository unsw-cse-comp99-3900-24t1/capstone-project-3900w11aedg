import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native';
import { Card } from '../config/types';
import sortFunction from '../helper/sorting';

type Props = {
  cards: Card[];
  setCards: (cards: Card[]) => void;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setSortText: (text: string) => void;
};

const SortOverlay = ({ cards, setCards, modalVisible, setModalVisible, setSortText }: Props) => {
  const [sort, setSort] = useState(() => sortFunction(cards, 'creationDate'));
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleClose = () => {
    handleSort();
    setModalVisible(false);
  };

  const handleSort = () => {
    setSortText(selectedValue === null ? 'Sort' : selectedValue);
    if (selectedValue === null) {
      return;
    }
    setSort(() => sortFunction(cards, selectedValue as keyof Card));
    setCards(sort);
  };

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={handleClose}>
      <Pressable
        className="flex-1 justify-center items-center bg-dark-green opacity-80"
        onPress={handleClose}
      >
        <View className="w-full">
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
              }}
            />
            <RadioButton
              label="Issuer (A -> Z)"
              value="Issuer"
              selected={selectedValue === 'Issued by'}
              onSelect={() => {
                setSelectedValue('Issued by');
              }}
            />
            <RadioButton
              label="Type (A -> Z)"
              value="Type"
              selected={selectedValue === 'Type'}
              onSelect={() => {
                setSelectedValue('Type');
              }}
            />
            <RadioButton
              label="Creation Date (newest -> oldest)"
              value="Creation Date"
              selected={selectedValue === 'Creation Date'}
              onSelect={() => {
                setSelectedValue('Creation Date');
              }}
            />
            <RadioButton
              label="Expiry Date (newest -> oldest)"
              value="Expiry Date"
              selected={selectedValue === 'Expiration Date'}
              onSelect={() => {
                setSelectedValue('Expiration Date');
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
