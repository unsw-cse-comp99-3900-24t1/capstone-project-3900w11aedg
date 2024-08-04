import React from 'react';
import { render } from '@testing-library/react-native';
import HistoryDropdown from '../src/components/HistoryDropdown.tsx';

describe('HistoryDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <HistoryDropdown
        claims={[
          ['test1', 'test2'],
          ['test3', 'test4'],
        ]}
      />
    );

    expect(getByText('Claims presented:')).toBeTruthy();
    expect(getByText('Test1')).toBeTruthy();
    expect(getByText('Test3')).toBeTruthy();
  });
});
