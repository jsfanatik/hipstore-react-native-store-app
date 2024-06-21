import React from 'react';
import { render } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout'; // Adjust the import path
import { NavigationContainer } from '@react-navigation/native';

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
  it('renders the Home tab initially', () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    expect(getByText('Home')).toBeTruthy(); // Ensure the Home tab is rendered
  });

  it('renders the Favorites tab', () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    expect(getByText('Favorites')).toBeTruthy(); // Ensure the Home tab is rendered
  });

  it('renders the Cart tab', () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    expect(getByText('Cart')).toBeTruthy(); // Ensure the Home tab is rendered
  });

  it('renders the Profile tab', () => {
    const { getByText } = render(
      <NavigationContainer>
        <TabLayout />
      </NavigationContainer>
    );
    expect(getByText('Profile')).toBeTruthy(); // Ensure the Home tab is rendered
  });
});