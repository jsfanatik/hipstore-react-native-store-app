import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import { Alert, View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import * as SecureStore from 'expo-secure-store';

export default function ProductDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const bottomSheetRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Product Details',
      headerTintColor: '#333',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => addToFavorites()}>
            <MaterialCommunityIcons name={favorites.some(item => item && item.id === product.id) ? 'heart' : 'heart-outline'} size={24} style={{ marginRight: 15 }} color="#666" />
          </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('share')}>
            <MaterialCommunityIcons name='export-variant' size={22} style={{ marginRight: 15 }} color="#666" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, product, favorites]);

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('user').then((user) => {
        setUser(user);
      });
    }, [])
  );

  useEffect(() => {
    if (route.params && route.params.product) {
      setProduct(route.params.product);
    }
  }, [route.params]);

  // useEffect to check if product is in favorites
  useEffect(() => {
    const checkFavorites = async () => {
      const favorites = await AsyncStorage.getItem('favorites');
      // console.log('Favorites', favorites);
      setFavorites(favorites ? JSON.parse(favorites) : []);
    };
    checkFavorites();
  }, []);

  // useEffect to check if product is in cart
  useEffect(() => {
    const checkCart = async () => {
      const cart = await AsyncStorage.getItem('cart');
      setCart(cart ? JSON.parse(cart) : []);
    };
    checkCart();
  }, []);

  // add to favorites
  const addToFavorites = async () => {
    try {
      // check if user is logged in
      if (!user) {
        Alert.alert('you must login to add to favorites!');
        return;
      }
      // get favorites from async storage
      const favorites = await AsyncStorage.getItem('favorites');
      // parse favorites
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      // find index of product in favorites
      const index = favoritesArray.findIndex(item => item.id === product.id);
      // if product is already in favorites, remove it
      if (index !== -1) {
        // Item already exists, remove it
        favoritesArray.splice(index, 1);
        console.log('Item removed from favorites');
      } else {
        // Add new item
        favoritesArray.push(product);
        console.log('Item added to favorites');
      }
      // save favorites to async storage
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      // update state to reflect changes
      setFavorites(favoritesArray);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const addToCart = async () => {
    try {
      // check if user is logged in
      if (!user) {
        Alert.alert('you must login to add to cart!');
        return;
      }
      // get cart from async storage
      const cart = await AsyncStorage.getItem('cart');
      // parse cart
      const cartArray = cart ? JSON.parse(cart) : [];
      // find index of product in cart
      const index = cartArray.findIndex(item => item.id === product.id);
      // if product is already in cart, remove it
      if (index !== -1) {
        // Item already exists, remove it
        cartArray.splice(index, 1);
        console.log('Item removed from cart');
      } else {
        // Add new item
        cartArray.push(product);
      }
      // cartArray.push(product);
      await AsyncStorage.setItem('cart', JSON.stringify(cartArray));
      // update state to reflect changes
      setCart(cartArray);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product?.image }} style={styles.image} />
      <Text style={styles.title}>{product?.title}</Text>
      <Text style={styles.price}>${product?.price}</Text>
      <TouchableOpacity style={styles.detailsButton} onPress={() => bottomSheetRef.current.expand()}>
        <Text style={styles.detailsButtonText}>See details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.purchaseButton} onPress={() => addToCart()}>
        <Text style={styles.buttonText}>{cart.some(item => item.id === product.id) ? 'Remove from cart' : 'Add to cart'}</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[1, '75%']}
        style={[styles.bottomSheet]}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 20,
            marginHorizontal: 20,
            color: "#333",
          }}>
            {product?.title}
          </Text>
          <View style={{ 
              borderBottomColor: '#ccc', 
              borderBottomWidth: 1, 
              marginHorizontal: 20,
              marginTop: 10,
          }} />
          <Text style={{ 
            marginTop: 20, 
            marginHorizontal: 20, 
            fontSize: 16, 
            color: "#333" 
          }}>
            {product?.description}</Text>
        </View>
      </BottomSheet>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: 10
  },
  image: {
    width: 300, // Set width as needed
    height: 300, // Set height as needed
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  price: {
    marginTop: 10,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  detailsButton: {
    marginTop: 10,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  detailsButtonText: {
    color: '#555',
    // fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  purchaseButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'black',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 5,
    marginTop: 5,
  },
});