import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/HomeScreen';
import ProductDetails from '@/screens/ProductDetails';

const HomeStack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} />
    </HomeStack.Navigator>
  );
}

export default HomeStackNavigator;