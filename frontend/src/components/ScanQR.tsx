import { Image, Dimensions } from 'react-native';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

function ScanQR(): JSX.Element {
  return (
    <QRCodeScanner
      onRead={() => console.log('scanned')}
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
