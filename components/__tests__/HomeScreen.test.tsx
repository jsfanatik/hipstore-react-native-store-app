import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '@/screens/HomeScreen'; // Adjust the import path
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-native', () => {
    const actualReactNative = jest.requireActual('react-native'); // Import the actual module
    return {
        Animated: {
            createAnimatedComponent: (component) => component
        },
        FlatList: () => {
            return null;
        },
        ScrollView: () => {
            return null;
        },
        Text: () => {
            return null;
        },
        View: () => {
            return null;
        },
        TouchableOpacity: () => {
            return null;
        },
        useWindowDimensions: () => {
            return null;
        },
        SectionList: () => {
            return null;
        },
        StyleSheet: {
            ...actualReactNative.StyleSheet, // Spread actual StyleSheet methods
            create: jest.fn().mockImplementation((styles) => styles), // Ensure create is a function
        },
    };
});

jest.mock('react-native-elements', () => ({
  Card: () => {
    return null;
  },
  SearchBar: () => {
    return null;
  }
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(JSON.stringify([]))),
  setItem: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn()
}));

jest.mock('react-native-paper', () => ({
  useTheme: jest.fn()
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

describe('Home Screen', () => {
  it('renders the Home screen', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Home')).toBeTruthy(); // Ensure the Home tab is rendered
  });
});