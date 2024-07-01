import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LoginScreen from '@/screens/LoginScreen';
import HomeScreen from '@/screens/HomeScreen';
import ProductDetails from '@/screens/ProductDetails';

const HomeStack = createStackNavigator();

function HomeStackNavigator({ navigation = null, route = null }) {

  useEffect(() => {
    const getUser = async () => {
      const user = await SecureStore.getItemAsync('user');
      if (user) {
        navigation.navigate('HomeScreen'); // Navigate to HomeScreen if user is not null
      } else {
        navigation.navigate('LoginScreen'); // Navigate to LoginScreen if user is null
      }
    };
    getUser();
  }, [navigation]); // Added navigation to dependency array

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
      <HomeStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />      
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />      
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;