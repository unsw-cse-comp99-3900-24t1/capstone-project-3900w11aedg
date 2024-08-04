import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PresentCredential from '../src/components/PresentCredential';
import { mockCredential } from '../__mocks__/credentials_mock';
import { mockCard } from '../__mocks__/card_mock';
import { mockClaims } from '../__mocks__/claims_mock';

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

describe('PresentCredential', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render credentials and expand or collapse dropdown when pressed', () => {
    render(
      <PresentCredential
        credential={mockCard}
        addClaims={jest.fn()}
        claimsObject={mockClaims}
        chosenCredentials={[]}
        chooseCredential={jest.fn()}
        verifiableCredential={mockCredential}
      />
    );

    expect(screen.getByText('University Degree')).toBeTruthy();
    expect(screen.getByTestId('expiry-status-label')).toBeTruthy();

    fireEvent.press(screen.getByTestId('present-credentials-dropdown-icon'));

    expect(screen.getByText('Alumni Of')).toBeTruthy();
    expect(screen.getByText('University of New South Wales')).toBeTruthy();
    expect(screen.getByTestId('claim-checkbox')).toBeTruthy();
  });

  it('should not allow expired credentials to be pressed', () => {
    render(
      <PresentCredential
        credential={{ ...mockCard, expiryDate: '2020-01-01T00:00:00Z' }}
        addClaims={jest.fn()}
        claimsObject={mockClaims}
        chosenCredentials={[]}
        chooseCredential={jest.fn()}
        verifiableCredential={mockCredential}
      />
    );
    fireEvent.press(screen.getByTestId('present-credentials-dropdown-icon'));

    expect(screen.queryByText('Alumni Of')).toBeFalsy();
    expect(screen.queryByText('University of New South Wales')).toBeFalsy();
    expect(screen.queryByTestId('claim-checkbox')).toBeFalsy();
  });
});
