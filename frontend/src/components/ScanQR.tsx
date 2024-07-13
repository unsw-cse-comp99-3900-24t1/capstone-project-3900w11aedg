import { Image, Dimensions } from 'react-native';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

interface ScanQRProps {
  onRead: (route: string) => Promise<void>;
}

function ScanQR({ onRead }: ScanQRProps): JSX.Element {
  return (
    <QRCodeScanner
      onRead={(e) => {
        onRead(e.data);
      }}
      showMarker={true}
      customMarker={
        <Image
          className="h-[65%]"
          source={require('../assets/scan_marker.png')}
          resizeMode="contain"
        />
      }
      cameraStyle={{ height: Dimensions.get('window').height / 2 }}
    />
  );
}

export default ScanQR;
