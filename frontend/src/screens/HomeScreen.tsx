import {Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import IdentityCardList from '../components/IdentityCardList.tsx';

function HomeScreen() {
  return (
    <ScrollView>
      <Text style={styles.mainTitle}>Credentials</Text>
      <IdentityCardList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 28,
    padding: 30,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
