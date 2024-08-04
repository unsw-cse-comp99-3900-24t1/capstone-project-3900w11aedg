import { View } from 'react-native';
import RadioButton from './RadioButton';
import React from 'react';

type Props = {
  selectedValue: string | null;
  setSelectedValue: (value: string) => void;
  setReverse: (reverse: boolean) => void;
};

const RadioButtonList = ({ selectedValue, setSelectedValue, setReverse }: Props): JSX.Element => {
  return (
    <View>
      <RadioButton
        label="Name (A -> Z)"
        value="name"
        selected={selectedValue === 'Name'}
        onSelect={() => {
          setSelectedValue('Name');
          setReverse(true);
        }}
      />
      <RadioButton
        label="Name (Z -> A)"
        value="name"
        selected={selectedValue === 'NameR'}
        onSelect={() => {
          setSelectedValue('NameR');
          setReverse(false);
        }}
      />
      <RadioButton
        label="Issuer (A -> Z)"
        value="Issuer"
        selected={selectedValue === 'Issued by'}
        onSelect={() => {
          setSelectedValue('Issued by');
          setReverse(false);
        }}
      />
      <RadioButton
        label="Type"
        value="Type"
        selected={selectedValue === 'Type'}
        onSelect={() => {
          setSelectedValue('Type');
          setReverse(false);
        }}
      />
      <RadioButton
        label="Issuance Date (oldest -> newest)"
        value="Issuance Date"
        selected={selectedValue === 'Creation DateR'}
        onSelect={() => {
          setSelectedValue('Creation DateR');
          setReverse(true);
        }}
      />
      <RadioButton
        label="Issuance Date (newest -> oldest)"
        value="Issuance Date"
        selected={selectedValue === 'Issuance Date'}
        onSelect={() => {
          setSelectedValue('Issuance Date');
          setReverse(false);
        }}
      />
      <RadioButton
        label="Expiry Date (closest -> latest)"
        value="Expiry Date"
        selected={selectedValue === 'Expiration DateR'}
        onSelect={() => {
          setSelectedValue('Expiration DateR');
          setReverse(true);
        }}
      />
      <RadioButton
        label="Expiry Date (latest -> closest)"
        value="Expiry Date"
        selected={selectedValue === 'Expiration Date'}
        onSelect={() => {
          setSelectedValue('Expiration Date');
          setReverse(false);
        }}
      />
    </View>
  );
};

export default RadioButtonList;
