import React from 'react';
import { Image, View, Text, StyleSheet, Pressable } from 'react-native';
import FlipCard from 'react-native-flip-card';

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
  onPress: () => void;
}

const IdentityCard: React.FC<IProps> = ({ card, onPress }) => {
  return (
    <FlipCard>
      <View style={styles.frontCardContainer}>
        <View style={styles.frontCardContainerTop}>
          <Text style={styles.frontCardTitle}>{card.name}</Text>
          <View style={styles.frontCardContainerFlip}>
            <Image
              source={require('../assets/fliparrow.png')}
              className="w-[100%] h-[100%]"
              resizeMode="contain"
            />
          </View>
        </View>
        <Pressable onPress={onPress}>
          <View style={styles.frontCardContainerBottom}>
            <Text style={styles.text}>{card.type}</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.backCardContainer}>
        <View style={styles.backCardContainerTop}>
          <Text style={styles.frontCardTitle}>{card.name}</Text>
          <View style={styles.frontCardContainerFlip}>
            <Image
              source={require('../assets/fliparrow.png')}
              className="w-[100%] h-[100%]"
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.backCardContainerIssuedBy}>{card.credIssuedBy}</Text>
        <Pressable onPress={onPress}>
          <View style={styles.backCardContainerBottom}>
            <View style={styles.backCardContainerKey}>
              <Text>Name</Text>
              <Text>{card.type} No.</Text>
              <Text>{card.type} Type</Text>
            </View>
            <View style={styles.backCardContainerValue}>
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

const styles = StyleSheet.create({
  frontCardContainer: {
    height: 160,
    width: 320,
    backgroundColor: 'rgb(82, 126, 120)',
    borderRadius: 8,
  },
  frontCardTitle: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
    border: 2,
    height: 30,
  },
  frontCardContainerTop: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  frontCardContainerBottom: {
    height: 80,
    paddingLeft: 20,
  },
  frontCardContainerFlip: {
    width: 30,
    height: 30,
  },
  backCardContainer: {
    height: 160,
    width: 320,
    borderRadius: 8,
    backgroundColor: 'rgb(108, 114, 114)',
  },
  backCardContainerIssuedBy: {
    paddingLeft: 15,
  },
  backCardContainerBottom: {
    height: 80,
    flexDirection: 'row',
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-around',
  },
  backCardContainerTop: {
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    height: 30,
  },
  backCardContainerKey: {
    fontSize: 12,
  },
  backCardContainerValue: {
    fontSize: 12,
  },
});

export default IdentityCard;
