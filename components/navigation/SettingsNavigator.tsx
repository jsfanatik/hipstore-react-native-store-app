import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="SettingsScreen" component={SettingsScreen}/>
      <HomeStack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false, tabBarStyle: { display: 'none' } }}
        listeners={({ navigation }) => ({
          blur: () => navigation.replace('SettingsScreen') // Replace LoginScreen with ProfileScreen when navigating away
        })}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;