import { TouchableOpacity, Image } from 'react-native';
import React from 'react';

type Props = {
  claim: string;
  addClaims: (claim: string, isAdding: boolean, id: string) => void;
  id: string;
  claimsObject: { [key: string]: Set<string> };
  handleSelectionByClaim: (addingClaims: boolean) => void;
};

const ClaimCheckbox = ({
  claim,
  addClaims,
  id,
  claimsObject,
  handleSelectionByClaim,
}: Props): JSX.Element => {
  const [selected, setSelected] = React.useState(claimsObject[id] && claimsObject[id].has(claim));

  const checkbox = selected
    ? require('../assets/selected_checkbox.png')
    : require('../assets/empty_checkbox.png');

  const handleCheck = () => {
    handleSelectionByClaim(!selected);
    addClaims(claim, !selected, id);
    setSelected(!selected);
  };

  return (
    <TouchableOpacity onPress={handleCheck} className="w-[20%] flex flex-row justify-center">
      <Image source={checkbox} resizeMode="contain" className="w-[45%]" />
    </TouchableOpacity>
  );
};

export default ClaimCheckbox;
