import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import PresentCredentialList from '../src/components/PresentCredentialList';
import { mockClaimsRequest, mockClaims } from '../__mocks__/claims_mock';
import { mockCredential, mockStoredCredentials } from '../__mocks__/credentials_mock';
import { mockCard } from '../__mocks__/card_mock';
import * as Keychain from 'react-native-keychain';
import normaliseCredential from '../src/helper/normalise.ts';

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  getAllGenericPasswordServices: jest.fn(),
}));

jest.mock('../src/helper/normalise');

describe('PresentCredentialList', () => {
  const mockChooseCredential = jest.fn();
  const mockAddClaims = jest.fn();

  beforeEach(() => {
    (Keychain.getAllGenericPasswordServices as jest.Mock).mockResolvedValue(['1', '2', '3']);
    (Keychain.getGenericPassword as jest.Mock).mockImplementation(async ({ service }) =>
      mockStoredCredentials.find((credential) => credential.key === service)
    );
    const mockFetchData = normaliseCredential as jest.Mock;
    mockFetchData
      .mockReturnValueOnce(mockCard)
      .mockReturnValueOnce({ ...mockCard, name: 'Master Degree' })
      .mockReturnValueOnce({ ...mockCard, name: 'Personal Trainer Certificate' });
  });

  it('should filter credentials based on claimsObject and render correctly', async () => {
    render(
      <PresentCredentialList
        claimsRequest={mockClaimsRequest}
        chosenCredentials={[mockCredential]}
        chooseCredential={mockChooseCredential}
        addClaims={mockAddClaims}
        claimsObject={mockClaims}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('present-credential-card')).toBeTruthy();
      expect(screen.getByText('University Degree')).toBeTruthy();
      expect(screen.getByText('Master Degree')).toBeTruthy();
      expect(screen.queryByText('Personal Trainer Certificate')).toBeFalsy();
    });
  });
});
