import React from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../src/screens/HomeScreen';
import { render, waitFor } from '@testing-library/react-native';
import mockAxios from 'jest-mock-axios';

const mockCreatedDid = 'did:example:321';
jest.mock('axios');
jest.setTimeout(30000);
const mockDid = 'did:example:123';

describe('HomeScreen', () => {
  beforeEach(() => {
    AsyncStorage.removeItem('did');
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it('fetches and displays DID from AsyncStorage', async () => {
    await AsyncStorage.setItem('did', mockDid);
    const { findByText } = render(<HomeScreen />);
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('did'));
    await waitFor(async () => {
      expect(await findByText(`Your DID is ${mockDid}`)).toBeTruthy();
    });
  });

  it('DID does not exist in AsyncStorage so one is created', async () => {
    const { findByText } = render(<HomeScreen />);
    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('did'));
    mockAxios.mockResponse({ data: { did: mockCreatedDid } });

    await waitFor(() => expect(mockAxios.post).toHaveBeenCalled());
    await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith('did', mockCreatedDid));
    await waitFor(async () => {
      expect(await findByText(`Your DID is ${mockCreatedDid}`)).toBeTruthy();
    });
  });
});
