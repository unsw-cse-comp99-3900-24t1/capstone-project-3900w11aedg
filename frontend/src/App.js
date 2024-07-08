"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = require("@react-navigation/native");
const native_stack_1 = require("@react-navigation/native-stack");
const colours_1 = require("./config/colours");
const LoginScreen_1 = __importDefault(require("./screens/LoginScreen"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const HomeScreen_1 = __importDefault(require("./screens/HomeScreen"));
const Stack = (0, native_stack_1.createNativeStackNavigator)();
function App() {
    const scheme = (0, react_native_1.useColorScheme)();
    return (<react_native_safe_area_context_1.SafeAreaProvider>
      <native_1.NavigationContainer theme={scheme === 'dark' ? colours_1.DarkColours : colours_1.LightColours}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen_1.default} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component={HomeScreen_1.default} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </native_1.NavigationContainer>
    </react_native_safe_area_context_1.SafeAreaProvider>);
}
exports.default = App;
