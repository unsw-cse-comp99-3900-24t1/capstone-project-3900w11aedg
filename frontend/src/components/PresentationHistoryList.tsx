import React from 'react';
import { ScrollView, View } from 'react-native';
import { SuccessfulPresentation } from '../config/types';
import PresentationHistory from './PresentationHistory';

type HistoryListProps = {
  presentations: SuccessfulPresentation[];
};

const PresentationHistoryList = ({ presentations }: HistoryListProps) => {
  let key = 1;

  return (
    <View className="flex flex-col h-[60%]">
      <ScrollView>
        {presentations.map(
          (presentation) => (
            (key += 1),
            (
              <View key={key} className="m-2">
                <PresentationHistory presentation={presentation} />
                <View className="border-b border-gray-600" />
              </View>
            )
          )
        )}
      </ScrollView>
    </View>
  );
};

export default PresentationHistoryList;
