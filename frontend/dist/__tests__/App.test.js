"use strict";
/**
 * @format
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("react-native");
const react_1 = __importDefault(require("react"));
const App_1 = __importDefault(require("../src/App"));
// Note: import explicitly to use the types shipped with jest.
const globals_1 = require("@jest/globals");
// Note: test renderer must be required after react-native.
const react_test_renderer_1 = __importDefault(require("react-test-renderer"));
// Mocking the necessary modules
jest.mock('react-native-flip-card', () => ({
    NavigationContainer: ({ children }) => <>{children}</>,
    DefaultTheme: {},
    DarkTheme: {},
    useColorScheme: () => 'light',
}));
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }) => <>{children}</>,
    DefaultTheme: {},
    DarkTheme: {},
    useColorScheme: () => 'light',
}));
jest.mock('react-native-keychain', () => ({
    setGenericPassword: jest.fn(),
    getGenericPassword: jest.fn(),
    resetGenericPassword: jest.fn(),
}));
jest.mock('react-native-biometrics', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isSensorAvailable: jest.fn(),
        simplePrompt: jest.fn(),
    })),
    BiometryTypes: {
        Biometrics: 'Biometrics',
    },
}));
jest.mock('@react-navigation/native-stack', () => {
    return {
        createNativeStackNavigator: jest.fn().mockReturnValue({
            Navigator: ({ children }) => <>{children}</>,
            Screen: ({ children }) => <>{children}</>,
        }),
    };
});
(0, globals_1.it)('renders correctly', () => {
    react_test_renderer_1.default.create(<App_1.default />);
});
