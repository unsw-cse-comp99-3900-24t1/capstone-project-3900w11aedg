import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import { LinearGradient } from 'react-native-linear-gradient';

const IdentityCard = ({card}) => {
  return (
    <View style={styles.linearGradient}>
      <View style={styles.card}>
        <Text style={styles.title}>{card.name}</Text>
        <Text style={styles.text}>{card.type}</Text>
      </View>
    </View>
    // <LinearGradient colors={['rgb(32, 43, 42)', 'rgb(82, 126, 120)']}  style={styles.linearGradient }>
    // </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 0,
    height: 120,
    width: 250,
  },
  title: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {},
  linearGradient: {
    borderRadius: 8,
    margin: 15,
    backgroundColor: 'rgb(82, 126, 120)',
  },
});

export default IdentityCard;
