import React from 'react';
import { ScrollView, View } from 'react-native';
import { VerifiablePresentation } from '../config/types';
import PresentationHistory from './PresentationHistory';

type HistoryListProps = {
  presentations: VerifiablePresentation[];
};

const PresentationHistoryList = ({ presentations }: HistoryListProps) => {
  return (
    <View className="flex flex-col h-[60%]">
      <ScrollView>
        {presentations.map((presentation) => (
          <View key={presentation.id} className="m-2">
            <PresentationHistory presentation={presentation} />
            <View className="border-b border-gray-600" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PresentationHistoryList;