import React from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {DarkColours, LightColours} from './config/colours';
import {RootStackParamList} from './config/types';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkColours : LightColours}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
