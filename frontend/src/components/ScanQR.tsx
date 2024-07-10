import { View } from 'react-native';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

function ScanQR(): JSX.Element {
  return (
    <View className="w-[80%] h-[80%]">
      <QRCodeScanner onRead={() => console.log('scanned')} />
    </View>
  );
}

export default ScanQR;
