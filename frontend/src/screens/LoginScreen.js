"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("../components/Header"));
const react_native_1 = require("react-native");
const LoginButton_1 = __importDefault(require("../components/LoginButton"));
function LoginScreen() {
    return (<react_native_1.View className="flex items-center">
      <Header_1.default />
      <react_native_1.Image source={require('../assets/large_logo.png')} className="w-[50%] h-[50%]" resizeMode="contain"/>
      <LoginButton_1.default />
    </react_native_1.View>);
}
exports.default = LoginScreen;
