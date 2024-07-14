import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import jsQR from 'jsqr';
import jpeg from 'jpeg-js';
import { decode } from 'fast-png';
import { Buffer } from 'buffer';
import React from 'react';

interface ScanQRProps {
  onRead: (route: string) => Promise<void>;
}

type ImageAsset = {
  base64: string;
  height: number;
  type: string;
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
      res.assets[0]?.type &&
      res.assets[0]?.width
    ) {
      const imageData: ImageAsset = {
        base64: res.assets[0].base64,
        height: res.assets[0].height,
        type: res.assets[0].type,
        width: res.assets[0].width,
      };
      setImage(imageData);
    }
  };

  const upload = async () => {
    try {
      if (image) {
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
          throw new Error('Invalid image type. Please upload a PNG or JPEG image.');
        }
        let qrCode;
        const buffer = Buffer.from(image.base64, 'base64');
        if (image.type === 'image/jpeg') {
          const rawImage = jpeg.decode(buffer, { useTArray: true });
          qrCode = jsQR(new Uint8ClampedArray(rawImage.data), image.width, image.height);
        } else if (image.type === 'image/png') {
          // png broken - only always has only 1 channel instead of 4
          const rawImage = decode(buffer);
          qrCode = jsQR(new Uint8ClampedArray(rawImage.data), image.width, image.height);
        }
        if (!qrCode?.data) {
          throw new Error('Image does not have a visible QR code.');
        }
        onRead(qrCode.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
      console.log(error);
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
            source={{ uri: `data:${image.type};base64,${image.base64}` }}
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
