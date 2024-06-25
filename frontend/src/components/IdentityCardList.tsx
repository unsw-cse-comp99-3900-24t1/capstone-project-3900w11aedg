import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, Pressable } from 'react-native';
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
    <View style={styles.list}>
      {cards.map((card) => (
        <View key={card.id} style={styles.cardContainer}>
          <IdentityCard card={card} onPress={() => handleCardPress(card)} />
          <Modal
            visible={!!selectedCard}
            transparent={true}
            animationType="slide"
            onRequestClose={handleCloseModal}
          >
            <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
              <Pressable style={styles.modalContent} onPress={() => {}}>
                {selectedCard && (
                  <>
                    <View style={styles.modalInsideContent}>
                      <View style={styles.cardDetails}>
                        <View style={styles.cardDetailsKey}>
                          <Text>Issued By</Text>
                          <Text>Created</Text>
                          <Text>Expiry</Text>
                        </View>
                        <View style={styles.cardDetailsValue}>
                          <Text>{selectedCard.credIssuedBy}</Text>
                          <Text>{selectedCard.creationDate}</Text>
                          <Text>{selectedCard.expiryDate}</Text>
                        </View>
                      </View>
                      <View style={styles.qrCodeBlock} />
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

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    margin: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 330,
    height: 400,
    padding: 20,
    backgroundColor: 'rgb(143, 149, 149)',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInsideContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
    color: 'green',
  },
  qrCodeBlock: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
  },
  cardDetails: {
    height: 80,
    width: 270,
    flexDirection: 'row',
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgb(96, 102, 101)',
    borderRadius: 8,
    justifyContent: 'space-around',
  },
  cardDetailsKey: {},
  cardDetailsValue: {},
});

export default IdentityCardList;
