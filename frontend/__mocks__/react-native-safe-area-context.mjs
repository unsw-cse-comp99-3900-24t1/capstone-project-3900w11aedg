// __mocks__/react-native-safe-area-context.js

const mock = jest.requireActual('react-native-safe-area-context/jest/mock');

export default {
  ...mock,
  SafeAreaProvider: mock.SafeAreaProvider,
  SafeAreaView: mock.SafeAreaView,
  useSafeAreaInsets: mock.useSafeAreaInsets,
};
