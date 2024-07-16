import { Image, View } from 'react-native';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

interface ScanQRProps {
  onRead: (route: string) => Promise<void>;
}

function ScanQR({ onRead }: ScanQRProps): JSX.Element {
  return (
    <View className="mt-[100px] relative">
      <QRCodeScanner
        onRead={(e) => {
          onRead(e.data);
        }}
        reactivate={true}
        reactivateTimeout={5000}
        showMarker={true}
        customMarker={
          <Image
            className="h-[65%]"
            source={require('../assets/scan_marker.png')}
            resizeMode="contain"
          />
        }
      />
    </View>
  );
}

export default ScanQR;
