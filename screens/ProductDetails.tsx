import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ProductDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

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
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      const index = favoritesArray.findIndex(item => item.id === product.id);
  
      if (index !== -1) {
        // Item already exists, remove it
        favoritesArray.splice(index, 1);
        console.log('Item removed from favorites');
      } else {
        // Add new item
        favoritesArray.push(product);
        console.log('Item added to favorites');
      }
  
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setFavorites(favoritesArray); // Update state to reflect changes
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const addToCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      const cartArray = cart ? JSON.parse(cart) : [];
      const index = cartArray.findIndex(item => item.id === product.id);

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
      setCart(cartArray);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product?.image }} style={styles.image} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{product?.title}</Text>
      </View>
      <Text style={styles.price}>${product?.price}</Text>
      <TouchableOpacity style={styles.purchaseButton} onPress={() => addToCart()}>
        <Text style={styles.buttonText}>{cart.some(item => item.id === product.id) ? 'Remove from cart' : 'Add to cart'}</Text>
      </TouchableOpacity>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  title: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    // paddingHorizontal: 10,
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
});