import { View } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScanQR from '../components/ScanQR';

function ScanScreen(): JSX.Element {
  // const [method, setMethod] = React.useState('Scan');
  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <ScanQR />
      <Footer />
    </View>
  );
}

export default ScanScreen;
