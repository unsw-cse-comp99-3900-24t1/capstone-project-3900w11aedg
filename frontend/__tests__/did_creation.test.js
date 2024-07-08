"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    it('fetches and displays DID from AsyncStorage', () => __awaiter(void 0, void 0, void 0, function* () {
        yield async_storage_1.default.setItem('did', mockDid);
        const { findByText } = (0, react_native_1.render)(<HomeScreen_1.default />);
        yield (0, react_native_1.waitFor)(() => (0, globals_1.expect)(async_storage_1.default.getItem).toHaveBeenCalledWith('did'));
        yield (0, react_native_1.waitFor)(() => __awaiter(void 0, void 0, void 0, function* () {
            (0, globals_1.expect)(yield findByText(`Your DID is ${mockDid}`)).toBeTruthy();
        }));
    }));
    it('DID does not exist in AsyncStorage so one is created', () => __awaiter(void 0, void 0, void 0, function* () {
        const { findByText } = (0, react_native_1.render)(<HomeScreen_1.default />);
        yield (0, react_native_1.waitFor)(() => (0, globals_1.expect)(async_storage_1.default.getItem).toHaveBeenCalledWith('did'));
        jest_mock_axios_1.default.mockResponse({ data: { did: mockCreatedDid } });
        yield (0, react_native_1.waitFor)(() => (0, globals_1.expect)(jest_mock_axios_1.default.post).toHaveBeenCalled());
        yield (0, react_native_1.waitFor)(() => (0, globals_1.expect)(async_storage_1.default.setItem).toHaveBeenCalledWith('did', mockCreatedDid));
        yield (0, react_native_1.waitFor)(() => __awaiter(void 0, void 0, void 0, function* () {
            (0, globals_1.expect)(yield findByText(`Your DID is ${mockCreatedDid}`)).toBeTruthy();
        }));
    }));
});
