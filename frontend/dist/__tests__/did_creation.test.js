"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const HomeScreen_1 = __importDefault(require("../src/screens/HomeScreen"));
const react_native_1 = require("@testing-library/react-native");
const jest_mock_axios_1 = __importDefault(require("jest-mock-axios"));
const globals_1 = require("@jest/globals");
const mockCreatedDid = 'did:example:321';
jest.mock('axios');
jest.mock('react-native-keychain', () => ({
    setGenericPassword: jest.fn(() => Promise.resolve('mockPass')),
}));
jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }) => <>{children}</>,
    DefaultTheme: {},
    DarkTheme: {},
    useColorScheme: () => 'light',
}));
jest.mock('react-native-rsa-native', () => ({
    RSA: {
        generateKeys: jest.fn(() => Promise.resolve({ public: 'mockPublic', private: 'mockPrivate' })),
    },
}));
jest.setTimeout(30000);
const mockDid = 'did:example:123';
(0, globals_1.describe)('HomeScreen', () => {
    (0, globals_1.beforeEach)(() => {
        async_storage_1.default.removeItem('did');
        jest_mock_axios_1.default.reset();
        jest.clearAllMocks();
    });
    it('fetches and displays DID from AsyncStorage', async () => {
        await async_storage_1.default.setItem('did', mockDid);
        const { findByText } = (0, react_native_1.render)(<HomeScreen_1.default />);
        await (0, react_native_1.waitFor)(() => (0, globals_1.expect)(async_storage_1.default.getItem).toHaveBeenCalledWith('did'));
        await (0, react_native_1.waitFor)(async () => {
            (0, globals_1.expect)(await findByText(`Your DID is ${mockDid}`)).toBeTruthy();
        });
    });
    it('DID does not exist in AsyncStorage so one is created', async () => {
        const { findByText } = (0, react_native_1.render)(<HomeScreen_1.default />);
        await (0, react_native_1.waitFor)(() => (0, globals_1.expect)(async_storage_1.default.getItem).toHaveBeenCalledWith('did'));
        jest_mock_axios_1.default.mockResponse({ data: { did: mockCreatedDid } });
        await (0, react_native_1.waitFor)(() => (0, globals_1.expect)(jest_mock_axios_1.default.post).toHaveBeenCalled());
        await (0, react_native_1.waitFor)(() => (0, globals_1.expect)(async_storage_1.default.setItem).toHaveBeenCalledWith('did', mockCreatedDid));
        await (0, react_native_1.waitFor)(async () => {
            (0, globals_1.expect)(await findByText(`Your DID is ${mockCreatedDid}`)).toBeTruthy();
        });
    });
});
