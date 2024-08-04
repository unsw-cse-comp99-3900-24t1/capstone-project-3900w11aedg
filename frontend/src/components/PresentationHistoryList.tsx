import React from 'react';
import { ScrollView, View } from 'react-native';
import { SuccessfulPresentation } from '../config/types';
import PresentationHistory from './PresentationHistory';

type Props = {
  presentations: SuccessfulPresentation[];
};

const PresentationHistoryList = ({ presentations }: Props): JSX.Element => {
  return (
    <View className="flex flex-col h-[60%]">
      <ScrollView>
        {presentations.map((presentation, index) => (
          <View key={index} className="m-2">
            <PresentationHistory presentation={presentation} />
            <View className="border-b border-gray-600" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PresentationHistoryList;
