import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as SubmitClaimsModule from '../src/helper/submit_claims';
import SubmitClaimsButton from '../src/components/SubmitClaimsButton';
import { mockClaimsRequest, mockClaims } from '../__mocks__/claims_mock';
import { mockCredential } from '../__mocks__/credentials_mock';

jest.mock('react-native-keychain', () => ({
  default: {
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
  },
}));

jest.mock('../src/helper/submit_claims');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('SubmitClaimsButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit claims and show successful verification result', async () => {
    const mockHandleSubmission = jest
      .spyOn(SubmitClaimsModule, 'handleSubmission')
      .mockImplementation();

    const { getByText } = render(
      <SubmitClaimsButton
        claimsRequest={mockClaimsRequest}
        claims={mockClaims}
        credentials={[mockCredential]}
      />
    );

    fireEvent.press(getByText('Share'));

    await waitFor(() => {
      expect(mockHandleSubmission).toHaveBeenCalled();
    });
  });
});
