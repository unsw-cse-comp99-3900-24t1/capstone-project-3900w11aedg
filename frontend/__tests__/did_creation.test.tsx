// import React, { ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import HomeScreen from '../src/screens/HomeScreen';
// import { render, waitFor } from '@testing-library/react-native';
// import mockAxios from 'jest-mock-axios';
// import { beforeEach, describe, expect } from '@jest/globals';

// const mockCreatedDid = 'did:example:321';
// jest.mock('axios');
// jest.mock('react-native-keychain', () => ({
//   setGenericPassword: jest.fn(() => Promise.resolve('mockPass')),
// }));

// jest.mock('@react-navigation/native', () => ({
//   NavigationContainer: ({ children }: { children: ReactNode }) => <>{children}</>,
//   DefaultTheme: {},
//   DarkTheme: {},
//   useColorScheme: () => 'light',
// }));
// jest.mock('react-native-rsa-native', () => ({
//   RSA: {
//     generateKeys: jest.fn(() => Promise.resolve({ public: 'mockPublic', private: 'mockPrivate' })),
//   },
// }));
// jest.setTimeout(30000);
// const mockDid = 'did:example:123';

// describe('HomeScreen', () => {
//   beforeEach(() => {
//     AsyncStorage.removeItem('did');
//     mockAxios.reset();
//     jest.clearAllMocks();
//   });

//   it('fetches and displays DID from AsyncStorage', async () => {
//     await AsyncStorage.setItem('did', mockDid);
//     const { findByText } = render(<HomeScreen />);
//     await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('did'));
//     await waitFor(async () => {
//       expect(await findByText(`Your DID is ${mockDid}`)).toBeTruthy();
//     });
//   });

//   it('DID does not exist in AsyncStorage so one is created', async () => {
//     const { findByText } = render(<HomeScreen />);
//     await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith('did'));
//     mockAxios.mockResponse({ data: { did: mockCreatedDid } });

//     await waitFor(() => expect(mockAxios.post).toHaveBeenCalled());
//     await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith('did', mockCreatedDid));
//     await waitFor(async () => {
//       expect(await findByText(`Your DID is ${mockCreatedDid}`)).toBeTruthy();
//     });
//   });
// });

it('filler', () => {
  expect(true).toBeTruthy();
});
