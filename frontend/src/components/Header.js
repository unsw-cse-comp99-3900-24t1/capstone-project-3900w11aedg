"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
function Header() {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    return (<react_native_1.View className={`pt-${insets.top} flex flex-row justify-between h-[100px] w-[100%] p-[20px]`}>
      <react_native_1.Image className="h-[40px] w-[40px]" source={require('../assets/smol_logo.png')} resizeMode="contain"/>
    </react_native_1.View>);
}
exports.default = Header;
