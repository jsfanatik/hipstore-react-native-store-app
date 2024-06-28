import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/LoginScreen';
import SettingsScreen from '@/screens/SettingsScreen';

const HomeStack = createStackNavigator();

function HomeStackNavigator({ navigation, route }) {

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'LoginScreen';
    console.log('routeName', routeName);
    if (routeName === 'LoginScreen') {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
    } else {
      navigation.setOptions({ tabBarStyle: { display: 'flex' } });
    }
  }, [navigation, route]);

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