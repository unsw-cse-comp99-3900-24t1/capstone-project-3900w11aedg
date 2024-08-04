import React from 'react';
import { render } from '@testing-library/react-native';
import ExpiryStatusLabel from '../src/components/ExpiryStatusLabel.tsx';

describe('ExpiryStatusLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when expired', () => {
    const { getByText } = render(<ExpiryStatusLabel {...{ isExpired: true }} />);

    expect(getByText('Expired')).toBeTruthy();
  });

  it('renders correctly when not expired', () => {
    const { getByText } = render(<ExpiryStatusLabel {...{ isExpired: false }} />);

    expect(getByText('Valid')).toBeTruthy();
  });
});
