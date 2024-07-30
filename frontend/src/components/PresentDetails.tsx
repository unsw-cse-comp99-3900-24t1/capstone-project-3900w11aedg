import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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

type ClaimsObject = {
  [key: string]: string[];
};

type NavProps = NativeStackNavigationProp<RootStackParamList>;

function PresentDetails({ claimsRequest }: Props): JSX.Element {
  const [chosenClaims, setChosenClaims] = React.useState<ClaimsObject>({} as ClaimsObject);
  const [validCredentials, setValidCredentials] = React.useState<VerifiableCredential[]>([]);
  const navigation = useNavigation<NavProps>();

  const updateChosenClaims = React.useCallback(
    (newClaim: string, addingClaim: boolean, id: string) => {
      setChosenClaims((prevClaims) => {
        if (!Object.keys(prevClaims).includes(id)) {
          prevClaims[id] = [];
        }
        if (addingClaim) {
          const copyClaims = { ...prevClaims };
          if (!Object.keys(copyClaims).includes(id)) {
            copyClaims[id] = [newClaim];
            return copyClaims;
          }
          (copyClaims[id] as string[]).push(newClaim);
          return copyClaims;
        } else {
          const copyClaims = { ...prevClaims };
          const claimsAtId = copyClaims[id] as string[];
          const claimIndex = claimsAtId.indexOf(newClaim);
          if (claimIndex > -1) {
            claimsAtId.splice(claimIndex, 1);
            copyClaims[id] = claimsAtId;
            return copyClaims;
          }
          return prevClaims;
        }
      });
    },
    [chosenClaims]
  );

  return (
    <View className="flex h-[73%]">
      <ScrollView className="px-[5%] mt-[15px] flex">
        <Text className="text-black dark:text-white text-lg">
          The Service Provider is requesting to verify your:
        </Text>
        {claimsRequest.query.claims.input_descriptors.map((inputDescriptor) => (
          <Text
            className="text-black dark:text-white ml-[5px] text-lg"
            key={`${inputDescriptor.id}`}
          >
            {`\u2022 ${inputDescriptor.id}`}
          </Text>
        ))}
        <PresentCredentialList
          claimsRequest={claimsRequest}
          setCredentialsRequest={setValidCredentials}
          addClaims={updateChosenClaims}
        />
      </ScrollView>
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
          credentials={validCredentials}
        />
      </View>
    </View>
  );
}

export default PresentDetails;
