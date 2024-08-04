import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ClaimsRequest, VerifiableCredential } from '../config/types';
import PresentCredentialList from '../components/PresentCredentialList';
import SubmitClaimsButton from './SubmitClaimsButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';

type Props = {
  claimsRequest: ClaimsRequest;
};

type NavProps = NativeStackNavigationProp<RootStackParamList>;

const PresentDetails = ({ claimsRequest }: Props): React.ReactElement => {
  const [chosenClaims, setChosenClaims] = React.useState<{ [key: string]: Set<string> }>({});
  const [chosenCredentials, setChosenCredentials] = React.useState<VerifiableCredential[]>([]);
  const navigation = useNavigation<NavProps>();

  const updateChosenClaims = React.useCallback(
    (newClaim: string, addingClaim: boolean, id: string) => {
      setChosenClaims((prevClaims) => {
        if (!Object.keys(prevClaims).includes(id)) {
          prevClaims[id] = new Set<string>();
        }
        if (addingClaim) {
          const copyClaims = { ...prevClaims };
          (copyClaims[id] as Set<string>).add(newClaim);
          return copyClaims;
        } else {
          const copyClaims = { ...prevClaims };
          (copyClaims[id] as Set<string>).delete(newClaim);
          return copyClaims;
        }
      });
    },
    []
  );

  const chooseCredential = async (credential: VerifiableCredential) => {
    setChosenCredentials((prevCredentials) => {
      if (prevCredentials.includes(credential)) {
        return prevCredentials.filter((cred: VerifiableCredential) => cred !== credential);
      }
      return [...prevCredentials, credential];
    });
  };

  return (
    <View className="flex w-80 flex-col mx-auto space-y-5">
      <Text className="text-black dark:text-white text-lg">
        {claimsRequest.query.claims.id} is requesting to verify your:
      </Text>
      {claimsRequest.query.claims.input_descriptors.map((inputDescriptor) => (
        <Text className="text-black dark:text-white ml-[5px] text-lg" key={`${inputDescriptor.id}`}>
          {`\u2022 ${inputDescriptor.id}`}
        </Text>
      ))}
      <PresentCredentialList
        claimsRequest={claimsRequest}
        claimsObject={chosenClaims}
        chooseCredential={chooseCredential}
        chosenCredentials={chosenCredentials}
        addClaims={updateChosenClaims}
      />
      <View className="flex flex-row justify-between px-[5%]">
        <TouchableOpacity className="bg-button-grey w-[35%] p-[5px] rounded-[5px]">
          <Text
            className="text-black text-lg font-medium text-center"
            onPress={() => navigation.navigate('Home')}
          >
            Cancel
          </Text>
        </TouchableOpacity>
        <SubmitClaimsButton
          claimsRequest={claimsRequest}
          claims={chosenClaims}
          credentials={chosenCredentials}
        />
      </View>
    </View>
  );
};

export default PresentDetails;
