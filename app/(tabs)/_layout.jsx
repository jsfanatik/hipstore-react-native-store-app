import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeStackNavigator from '@/components/navigation/HomeStackNavigator'; // Adjust the path as necessary
import FavoritesNavigator from '@/components/navigation/FavoritesNavigator';
import CartNavigator from '@/components/navigation/CartNavigator';
import SettingsNavigator from '@/components/navigation/SettingsNavigator';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }
          return <TabBarIcon name={iconName || 'default-icon'} color={color} />;
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
        options={{ tabBarTestID: 'Home' }}
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
        options={{ tabBarTestID: 'Favorites' }}
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
        options={{ tabBarTestID: 'Cart' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the initial route of the HomeStackNavigator
            navigation.navigate('Cart', { screen: 'CartScreen' });
          },
        })}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsNavigator} 
        options={{ tabBarTestID: 'Settings' }} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            // Navigate to the initial route of the HomeStackNavigator
            navigation.navigate('Settings', { screen: 'SettingsScreen' });
          },
        })}
      />
    </Tab.Navigator>
  );
}