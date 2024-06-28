import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from '@/screens/FavoritesScreen';
import ProductDetails from '@/screens/ProductDetails';

const HomeStack = createStackNavigator();

function FavoritesNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="FavoritesScreen" component={FavoritesScreen} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} />
    </HomeStack.Navigator>
  );
}

export default FavoritesNavigator;