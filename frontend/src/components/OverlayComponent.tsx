import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  modalVisible: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  leftOption: string;
  handleDelete: () => void;
  rightOption: string;
};

const OverlayComponent = ({
  modalVisible,
  handleClose,
  title,
  description,
  leftOption,
  handleDelete,
  rightOption,
}: Props): React.ReactElement => {
  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={handleClose}>
      <Pressable
        className="flex-1 justify-center items-center bg-dark-green opacity-90"
        onPress={handleClose}
      >
        <View className="bg-settings-grey w-90 h-200 rounded-2xl">
          <View className={'flex flex-col'} />
          <Text className="text-2xl my-2 mx-auto text-white text-center font-bold pt-4 px-4 pb-4">
            {title}
          </Text>
          <Text className={'text-lg text-white pt-2 px-4 pb-6'}>{description}</Text>
          <View className="flex flex-row mx-4 mb-4 ">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-blurred-grey rounded-md mr-2 text-center"
            >
              <Text className="mx-auto font-bold text-white text-base py-2">{leftOption}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 bg-red-500 rounded-md text-center"
            >
              <Text className="mx-auto font-bold text-white text-base py-2">{rightOption}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default OverlayComponent;
