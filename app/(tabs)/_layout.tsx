import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useCallback } from 'react';
import { Badge } from 'react-native-paper';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// import HomeScreen from '@/app/(tabs)/index';
import HomeStackNavigator from '@/components/navigation/HomeStackNavigator'; // Adjust the path as necessary
import FavoritesNavigator from '@/components/navigation/FavoritesNavigator';
import CartNavigator from '@/components/navigation/CartNavigator';
import ProfileScreen from '@/app/(tabs)/profile';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [cartItems, setCartItems] = useState([]);


  // Get favorites from async storage
  const getCartItems = async () => {
    const cart = await AsyncStorage.getItem('cart');
    setCartItems(cart ? JSON.parse(cart) : []);
  };

  // Get favorites when the screen is focused
  useFocusEffect(
    useCallback(() => {
      getCartItems();
    }, [])
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <TabBarIcon name={iconName} color={color} />;
        },
        // tabBarLabel: '',
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the initial route of the HomeStackNavigator
            navigation.navigate('Home', { screen: 'HomeScreen' });
          },
        })}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesNavigator} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the initial route of the HomeStackNavigator
            navigation.navigate('Favorites', { screen: 'FavoritesScreen' });
          },
        })}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartNavigator} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the initial route of the HomeStackNavigator
            navigation.navigate('Cart', { screen: 'CartScreen' });
          },
        })}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}