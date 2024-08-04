import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ClaimCheckbox from '../src/components/ClaimCheckbox.tsx';

describe('ClaimCheckbox', () => {
  const mockAddClaims = jest.fn();
  const mockHandleSelectionByClaim = jest.fn();

  const defaultProps = {
    claim: 'testClaim',
    addClaims: mockAddClaims,
    id: 'testId',
    claimsObject: { testId: new Set<string>(['testClaim']) },
    handleSelectionByClaim: mockHandleSelectionByClaim,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with selected state', () => {
    const { getByTestId } = render(<ClaimCheckbox {...defaultProps} />);
    const checkbox = getByTestId('test');
    expect(checkbox).toBeTruthy();
    expect(
      checkbox.findByProps({ source: require('../src/assets/selected_checkbox.png') })
    ).toBeTruthy();
  });

  it('renders correctly with unselected state', () => {
    const props = {
      ...defaultProps,
      claimsObject: { testId: new Set<string>() },
    };
    const { getByTestId } = render(<ClaimCheckbox {...props} />);
    const checkbox = getByTestId('test');
    expect(checkbox).toBeTruthy();
    expect(
      checkbox.findByProps({ source: require('../src/assets/empty_checkbox.png') })
    ).toBeTruthy();
  });

  it('handles checkbox press correctly', () => {
    const { getByTestId } = render(<ClaimCheckbox {...defaultProps} />);
    const checkbox = getByTestId('test');

    fireEvent.press(checkbox);

    expect(mockHandleSelectionByClaim).toHaveBeenCalledWith(false);
    expect(mockAddClaims).toHaveBeenCalledWith('testClaim', false, 'testId');
    expect(
      checkbox.findByProps({ source: require('../src/assets/empty_checkbox.png') })
    ).toBeTruthy();
  });

  it('handles checkbox press correctly when initially unselected', () => {
    const props = {
      ...defaultProps,
      claimsObject: { testId: new Set<string>() },
    };
    const { getByTestId } = render(<ClaimCheckbox {...props} />);
    const checkbox = getByTestId('test');

    fireEvent.press(checkbox);

    expect(mockHandleSelectionByClaim).toHaveBeenCalledWith(true);
    expect(mockAddClaims).toHaveBeenCalledWith('testClaim', true, 'testId');
    expect(
      checkbox.findByProps({ source: require('../src/assets/selected_checkbox.png') })
    ).toBeTruthy();
  });
});
