import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/LoginScreen';
import HomeScreen from '@/screens/HomeScreen';
import ProductDetails from '@/screens/ProductDetails';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    SecureStore.getItemAsync('user').then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />      
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;