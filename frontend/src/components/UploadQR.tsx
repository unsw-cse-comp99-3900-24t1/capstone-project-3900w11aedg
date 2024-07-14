import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  BinaryBitmap,
  BarcodeFormat,
  MultiFormatReader,
  RGBLuminanceSource,
  HybridBinarizer,
  NotFoundException,
  DecodeHintType,
} from '@zxing/library';
import base64 from 'base-64';
import React from 'react';

interface ScanQRProps {
  onRead: (route: string) => Promise<void>;
}

type ImageAsset = {
  base64: string;
  height: number;
  uri: string;
  width: number;
} | null;

function UploadQR({ onRead }: ScanQRProps): JSX.Element {
  const [image, setImage] = React.useState<ImageAsset>(null);

  const getImage = async () => {
    const res = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
    });
    if (
      res.assets &&
      res.assets[0]?.base64 &&
      res.assets[0]?.height &&
      res.assets[0]?.uri &&
      res.assets[0]?.width
    ) {
      const imageData: ImageAsset = {
        base64: res.assets[0].base64,
        height: res.assets[0].height,
        uri: res.assets[0].uri,
        width: res.assets[0].width,
      };
      setImage(imageData);
    }
  };

  const upload = async () => {
    try {
      if (image) {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
        hints.set(DecodeHintType.TRY_HARDER, true);
        const reader = new MultiFormatReader();
        const binaryString = base64.decode(image.base64);
        const bytes = new Uint8ClampedArray(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const luminanceSource = new RGBLuminanceSource(bytes, image.width, image.height);
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
        const url = reader.decode(binaryBitmap, hints);
        onRead(url.getText());
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        Alert.alert('Error', 'Please upload an image with a valid QR code.');
      } else {
        console.log(error);
      }
    }
  };

  return (
    <View className="flex flex-col items-center">
      <View className="flex w-[60%] h-[40%] p-[20px] mt-10 flex-col content-center justify-center items-center border-black dark:border-white border-[1px] border-dashed">
        {image !== null ? (
          <Image
            className="w-[90%] h-[90%]"
            resizeMode="contain"
            resizeMethod="scale"
            source={{ uri: image.uri }}
          />
        ) : (
          <>
            <Image
              source={require('../assets/upload.png')}
              className="w-[15%]"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={getImage}
              className="bg-theme-gold py-[3px] px-[20px] rounded-[15px]"
            >
              <Text className="text-black text-lg font-medium">Browse</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View className="flex flex-row w-[100%] justify-around mt-16">
        <TouchableOpacity
          className="bg-button-grey py-[3px] px-[30px] rounded-[5px]"
          onPress={() => setImage(null)}
        >
          <Text className="text-black text-lg font-medium">Clear </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-theme-gold py-[3px] px-[30px] rounded-[5px]"
          onPress={upload}
        >
          <Text className="text-black text-lg font-medium">Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default UploadQR;
