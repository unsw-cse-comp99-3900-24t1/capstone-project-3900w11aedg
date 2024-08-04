import { SuccessfulPresentation } from '../src/config/types';

export const mockSuccessfulPresentation: SuccessfulPresentation = {
  serviceProvider: 'Service Provider',
  date: '13 Jun 2021 08:44:10',
  claims: [
    ['claim1', 'value1'],
    ['claim2', 'value2'],
  ] as [string, string][],
};

export const createSuccessfulPresentations = (count: number): SuccessfulPresentation[] => {
  return Array.from({ length: count }, () => mockSuccessfulPresentation);
};
