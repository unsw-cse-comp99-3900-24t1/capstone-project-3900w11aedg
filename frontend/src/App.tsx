import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './config/types';
import LoginScreen from './screens/LoginScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import PresentScreen from './screens/PresentScreen';
import IssuanceScreen from './screens/IssuanceScreen';
import ViewScreen from './screens/ViewScreen';
import SettingsScreen from './screens/SettingsScreen';
import VerifiedScreen from './screens/VerifiedScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Present" component={PresentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Issue" component={IssuanceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="View" component={ViewScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Verified"
            component={VerifiedScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
