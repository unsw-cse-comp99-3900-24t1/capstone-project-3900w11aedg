"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const react_native_1 = require("react-native");
const react_native_biometrics_1 = __importStar(require("react-native-biometrics"));
const native_1 = require("@react-navigation/native");
function LoginButton() {
    const navigation = (0, native_1.useNavigation)();
    // Prompts user to enter biometric data, navigating to homescreen with success case
    const handleBiometricAuth = () => __awaiter(this, void 0, void 0, function* () {
        const rnBiometrics = new react_native_biometrics_1.default({ allowDeviceCredentials: true });
        const { biometryType } = yield rnBiometrics.isSensorAvailable();
        if (biometryType === react_native_biometrics_1.BiometryTypes.Biometrics) {
            try {
                const res = yield rnBiometrics.simplePrompt({
                    promptMessage: 'Log in',
                });
                if (res.success) {
                    navigation.navigate('Home');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            // If user has no security feature set
            navigation.navigate('Home');
        }
    });
    react_1.default.useEffect(() => {
        handleBiometricAuth();
        const handleAppState = (nextAppState) => __awaiter(this, void 0, void 0, function* () {
            if (nextAppState === 'background') {
                navigation.navigate('Login');
            }
            else if (nextAppState === 'active') {
                handleBiometricAuth();
            }
        });
        const subscription = react_native_1.AppState.addEventListener('change', handleAppState);
        return () => {
            subscription.remove();
        };
    });
    return <react_native_1.Button title="Log in" color="grey" onPress={handleBiometricAuth}/>;
}
exports.default = LoginButton;
