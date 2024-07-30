import { TouchableOpacity, Image } from 'react-native';
import React from 'react';

type Props = {
  claim: string;
  addClaims: (claim: string, isAdding: boolean, id: string) => void;
  index: string;
};

function ClaimCheckbox({ claim, addClaims, index }: Props): JSX.Element {
  const [selected, setSelected] = React.useState(false);
  const checkbox = selected
    ? require('../assets/selected_checkbox.png')
    : require('../assets/empty_checkbox.png');

  const handleCheck = () => {
    addClaims(claim, !selected, index);
    setSelected(!selected);
  };

  return (
    <TouchableOpacity onPress={handleCheck} className="w-[20%] flex flex-row justify-center">
      <Image source={checkbox} resizeMode="contain" className="w-[45%]" />
    </TouchableOpacity>
  );
}

export default ClaimCheckbox;
