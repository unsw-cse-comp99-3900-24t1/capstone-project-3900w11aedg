import { Image, View } from 'react-native';
import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

type Props = {
  onRead: (route: string) => Promise<void>;
};

const ScanQR = ({ onRead }: Props): React.ReactElement => {
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
};

export default ScanQR;
