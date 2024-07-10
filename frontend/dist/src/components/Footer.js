"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_1 = __importDefault(require("react"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const native_1 = require("@react-navigation/native");
function Footer() {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const navigation = (0, native_1.useNavigation)();
    return (<react_native_1.View className={`pt-${insets.bottom} pl-${insets.left} pr-${insets.right} absolute bottom-0 flex flex-row justify-evenly items-center h-[10%] w-[100%] bg-navbar-grey`}>
      <react_native_1.TouchableOpacity className="basis-[20%] flex items-center gap-1" onPress={() => navigation.navigate('Home')}>
        <react_native_1.Image source={require('../assets/credentials.png')} resizeMode="contain" className="w-[40%] h-[40%]"/>
        <react_native_1.Text className="text-theme-gold">Credentials</react_native_1.Text>
      </react_native_1.TouchableOpacity>
      <react_native_1.TouchableOpacity className="basis-[30%] flex items-center gap-1" onPress={() => navigation.navigate('Scan')}>
        <react_native_1.Image source={require('../assets/scan.png')} resizeMode="contain" className="w-[50%] h-[50%]"/>
        <react_native_1.Text className="text-theme-gold">Scan</react_native_1.Text>
      </react_native_1.TouchableOpacity>
      <react_native_1.TouchableOpacity className="basis-[20%] flex items-center gap-1">
        <react_native_1.Image source={require('../assets/settings.png')} resizeMode="contain" className="w-[35%] h-[35%]"/>
        <react_native_1.Text className="text-theme-gold">Settings</react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.View>);
}
exports.default = Footer;
