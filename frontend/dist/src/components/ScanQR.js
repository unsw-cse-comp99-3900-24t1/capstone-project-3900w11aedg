"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const react_native_qrcode_scanner_1 = __importDefault(require("react-native-qrcode-scanner"));
function ScanQR() {
    return (<react_native_1.View className="w-[80%] h-[80%]">
      <react_native_qrcode_scanner_1.default onRead={() => console.log('scanned')}/>
    </react_native_1.View>);
}
exports.default = ScanQR;
