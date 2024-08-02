import { Text, Modal, ActivityIndicator, View } from 'react-native';
import React from 'react';

function LoadingModal(): JSX.Element {
  return (
    <Modal transparent={true}>
      <View className="flex-1 justify-center items-center bg-dark-green opacity-90">
        <ActivityIndicator size="large" />
        <Text className="text-white text-lg">Processing QR code</Text>
      </View>
    </Modal>
  );
}

export default LoadingModal;
