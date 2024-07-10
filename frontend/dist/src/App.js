"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const native_1 = require("@react-navigation/native");
const native_stack_1 = require("@react-navigation/native-stack");
const LoginScreen_1 = __importDefault(require("./screens/LoginScreen"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const HomeScreen_1 = __importDefault(require("./screens/HomeScreen"));
const ScanScreen_1 = __importDefault(require("./screens/ScanScreen"));
const Stack = (0, native_stack_1.createNativeStackNavigator)();
function App() {
    return (<react_native_safe_area_context_1.SafeAreaProvider>
      <native_1.NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen_1.default} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component={HomeScreen_1.default} options={{ headerShown: false }}/>
          <Stack.Screen name="Scan" component={ScanScreen_1.default} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </native_1.NavigationContainer>
    </react_native_safe_area_context_1.SafeAreaProvider>);
}
exports.default = App;
