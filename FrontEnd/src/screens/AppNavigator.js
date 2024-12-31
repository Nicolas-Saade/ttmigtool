import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen1 from './WelcomeScreen1';
import WelcomeScreen2 from './WelcomeScreen2';
import HomeScreen from './HomeScreen'; // Keep your existing home screen
const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="WelcomeScreen1">
          <Stack.Screen 
            name="WelcomeScreen1" 
            component={WelcomeScreen1} 
            options={{ title: 'Welcome' }} 
          />
          <Stack.Screen 
            name="WelcomeScreen2" 
            component={WelcomeScreen2} 
            options={{ title: 'Get Started' }} 
          />
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ title: 'Home' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

export default AppNavigator;