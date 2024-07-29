import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

function SubmitClaimsButton(): JSX.Element {
  return (
    <TouchableOpacity className="bg-theme-gold w-[35%] p-[5px] rounded-[5px]">
      <Text className="text-black text-lg font-medium text-center">Share</Text>
    </TouchableOpacity>
  );
}

export default SubmitClaimsButton;
