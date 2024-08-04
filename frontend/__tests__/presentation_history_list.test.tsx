import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PresentationHistoryList from '../src/components/PresentationHistoryList';
import { createSuccessfulPresentations } from '../__mocks__/presentations_mock';
import { SuccessfulPresentation } from '../src/config/types';

const presentations: SuccessfulPresentation[] = createSuccessfulPresentations(5);

describe('PresentationHistoryList', () => {
  it('should render a list of presentations', () => {
    render(<PresentationHistoryList presentations={presentations} />);
    expect(screen.getAllByTestId('presentation-history-entry')).toHaveLength(presentations.length);
  });
});
