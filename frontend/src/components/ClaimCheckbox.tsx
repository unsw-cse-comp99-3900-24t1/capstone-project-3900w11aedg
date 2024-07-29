import { TouchableOpacity, Image } from 'react-native';
import React from 'react';

type Props = {
  claim: string;
  addClaims: (claim: string, isAdding: boolean) => void;
};

function ClaimCheckbox({ claim, addClaims }: Props): JSX.Element {
  const [selected, setSelected] = React.useState(false);
  const isRendering = React.useRef(false);
  const checkbox = selected
    ? require('../assets/selected_checkbox.png')
    : require('../assets/empty_checkbox.png');

  const handleCheck = () => {
    setSelected((prevSelected) => {
      if (!isRendering.current) {
        isRendering.current = true;
        addClaims(claim, !prevSelected);
        isRendering.current = false;
      }
      return !prevSelected;
    });
  };

  React.useEffect(() => {
    return () => {
      isRendering.current = false;
    };
  }, []);

  return (
    <TouchableOpacity onPress={handleCheck} className="w-[20%] flex flex-row justify-center">
      <Image source={checkbox} resizeMode="contain" className="w-[45%]" />
    </TouchableOpacity>
  );
}

export default ClaimCheckbox;
