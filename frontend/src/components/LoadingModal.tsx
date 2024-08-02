import { Text, Modal, ActivityIndicator, View } from 'react-native';
import React from 'react';

type Props = {
  loading: boolean;
};

function LoadingModal({ loading }: Props): JSX.Element {
  console.log('we just rendered!!!');
  return (
    <Modal transparent={true} visible={loading}>
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading</Text>
      </View>
    </Modal>
  );
}

export default LoadingModal;
