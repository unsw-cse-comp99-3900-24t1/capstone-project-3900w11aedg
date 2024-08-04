import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { mockSuccessfulPresentation } from '../__mocks__/presentations_mock';
import PresentationHistory from '../src/components/PresentationHistory';

describe('PresentationHistory', () => {
  it('should render the presentation service provider and date', () => {
    render(<PresentationHistory presentation={mockSuccessfulPresentation} />);

    expect(screen.getByText('Service Provider')).toBeTruthy();
    expect(screen.getByText('13 Jun 2021 08:44:10')).toBeTruthy();
  });

  it('should expand and collapse the dropdown when arrow is pressed', () => {
    render(<PresentationHistory presentation={mockSuccessfulPresentation} />);

    fireEvent.press(screen.getByTestId('presentation-history-dropdown-arrow'));
    expect(screen.getByTestId('history-dropdown')).toBeTruthy();

    fireEvent.press(screen.getByTestId('presentation-history-dropdown-arrow'));
    expect(screen.queryByTestId('history-dropdown')).toBeFalsy();
  });
});
