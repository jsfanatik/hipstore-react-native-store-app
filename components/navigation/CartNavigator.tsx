import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from '@/screens/FavoritesScreen';
import ProductDetails from '@/screens/ProductDetails';
import CartScreen from '@/screens/CartScreen';
import PurchaseScreen from '@/screens/PurchaseScreen';

const HomeStack = createStackNavigator();

function FavoritesNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="CartScreen" component={CartScreen} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} />
      <HomeStack.Screen name="PurchaseScreen" component={PurchaseScreen} />
    </HomeStack.Navigator>
  );
}

export default FavoritesNavigator;