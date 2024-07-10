"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const Header_1 = __importDefault(require("../components/Header"));
const Footer_1 = __importDefault(require("../components/Footer"));
const ScanQR_1 = __importDefault(require("../components/ScanQR"));
function ScanScreen() {
    const [method, setMethod] = react_1.default.useState('Scan');
    return (<react_native_1.View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header_1.default />
      <ScanQR_1.default />
      <Footer_1.default />
    </react_native_1.View>);
}
exports.default = ScanScreen;
