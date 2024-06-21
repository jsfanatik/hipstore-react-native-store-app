import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout'; // Adjust the import path
import { NavigationContainer } from '@react-navigation/native';

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(JSON.stringify([]))),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify([]))),
  setItem: jest.fn()
}));

// Mock RNGestureHandlerModule
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    TouchableOpacity: View,
    TouchableHighlight: View,
    TouchableWithoutFeedback: View,
    TouchableNativeFeedback: View,
    GestureHandlerRootView: View,
    default: {}
  };
});

describe('Tab Navigation', () => {
  it('renders the Home tab initially', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText('Home')).toBeTruthy(); // Ensure the Home tab is rendered
    });
    // expect(getByText('Home')).toBeTruthy(); // Ensure the Home tab is rendered
  });

  it('renders the Favorites tab', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText('Favorites')).toBeTruthy(); // Ensure the Home tab is rendered
    });
  });

  it('renders the Cart tab', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText('Cart')).toBeTruthy(); // Ensure the Home tab is rendered
    });
  });

  it('renders the Settings tab', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy(); // Ensure the Home tab is rendered
    });
  });
});