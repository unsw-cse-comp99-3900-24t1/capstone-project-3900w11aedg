import { TouchableOpacity, Image } from 'react-native';
import React from 'react';

// Put the claim in here, then setselectedclaims
function ClaimCheckbox(): JSX.Element {
  const [selected, setSelected] = React.useState(false);
  const checkbox = selected
    ? require('../assets/selected_checkbox.png')
    : require('../assets/empty_checkbox.png');

  return (
    <TouchableOpacity
      onPress={() => setSelected(!selected)}
      className="w-[20%] flex flex-row justify-center"
    >
      <Image source={checkbox} resizeMode="contain" className="w-[45%]" />
    </TouchableOpacity>
  );
}

export default ClaimCheckbox;
