import React, { useState, useLayoutEffect, useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Settings',
      headerLeft: () => null,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('user').then((user) => {
        setUser(user ? JSON.parse(user) : null);
      });
    }, [])
  );

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleLogout = () => {
    SecureStore.deleteItemAsync('user').then(() => {
      setUser(null);
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9'}}>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#333' }}>{user ? 'Logout' : 'Login'}</Text>
      </View>
      
      <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '100%',
          paddingHorizontal: 20, 
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity onPress={user ? handleLogout : handleLogin}>
          <MaterialCommunityIcons name={user ? 'logout-variant' : 'login-variant'} size={36} color={user ? 'red' : 'green'} />
        </TouchableOpacity>
      </View>
  </View>
  );
};
export default SettingsScreen;