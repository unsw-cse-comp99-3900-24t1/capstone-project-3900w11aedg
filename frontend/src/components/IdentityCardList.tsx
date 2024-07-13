import React, { useState, useEffect } from 'react';
import { View, Modal, Text, Pressable } from 'react-native';
import IdentityCard from './IdentityCard';

interface Card {
  id: number;
  name: string;
  type: string;
}

const IdentityCardList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          id: 1,
          creationDate: '15 Nov 2024',
          expiryDate: '15 Nov 2025',
          name: 'Drivers License',
          type: 'License',
          credIssuedBy: 'NSW Government',
          credNumber: '348203',
          credType: 'C LRN',
          credName: 'Lewis Hamilton',
        },
        {
          id: 2,
          creationDate: '23 Nov 2024',
          expiryDate: '23 Nov 2025',
          name: 'WCC',
          type: 'Certificate',
          credIssuedBy: 'NSW Government',
          credNumber: '46543346',
          credType: 'Employee',
          credName: 'Duke Dennis',
        },
      ];
      setCards(data);
    };
    fetchData();
  }, []);

  const handleCardPress = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <View className="flex flex-row flex-wrap justify-center">
      {cards.map((card) => (
        <View key={card.id} className="m-2">
          <IdentityCard card={card} onPress={() => handleCardPress(card)} />
          <Modal
            visible={!!selectedCard}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCloseModal}
          >
            <Pressable
              className="flex-1 justify-center items-center bg-dark-green opacity-80"
              onPress={handleCloseModal}
            >
              <Pressable
                className="w-[80%] h-[45%] p-5 bg-card-view-grey rounded-lg items-center"
                onPress={() => {}}
              >
                {selectedCard && (
                  <>
                    <View className="p-5 space-y-5 flex-1 justify-start items-center">
                      <View className="h-20 w-[100%] flex-row pt-1 px-4 space-x-4 bg-card-view-grey rounded-md justify-around">
                        <View>
                          <Text className="text-white font-medium">Issued By</Text>
                          <Text className="text-white font-medium">Created</Text>
                          <Text className="text-white font-medium">Expiry</Text>
                        </View>
                        <View>
                          <Text className="text-grey">{selectedCard.credIssuedBy}</Text>
                          <Text className="text-grey">{selectedCard.creationDate}</Text>
                          <Text className="text-grey">{selectedCard.expiryDate}</Text>
                        </View>
                      </View>
                      <View className="p-3 bg-card-view-grey rounded-md justify-around">
                        <Text className="text-red-500 font-bold">Remove Credential</Text>
                      </View>
                    </View>
                  </>
                )}
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      ))}
    </View>
  );
};

export default IdentityCardList;
