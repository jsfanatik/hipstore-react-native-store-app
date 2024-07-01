import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { FlatList, Alert, View, Text, StyleSheet, LayoutAnimation, useWindowDimensions, TouchableOpacity, Animated } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from '@gorhom/bottom-sheet';
import helpGuide from '../data/helpGuide';

const CartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const imageAnimValues = useRef({});
  const helpSheetRef = useRef(null);

  //set options for the header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Cart',
      headerTintColor: '#333',
      headerRight: () => (
        <TouchableOpacity onPress={() => helpSheetRef.current.expand()}>
          <IconButton icon="help-circle-outline" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  // Function to remove item from cart
  const handleRemoveItem = async (rowMap = null, rowKey = null) => {
    // get the list without the item
    const updateList = cartItems.filter(item => item.id !== rowKey);
    // remove item from AsyncStorage
    await AsyncStorage.setItem('cart', JSON.stringify(updateList));
    // animate the list
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // update the state
    setCartItems(updateList);
    // close the row
    if (rowMap[rowKey] && rowMap[rowKey].closeRow) {
      rowMap[rowKey].closeRow();
    }
  };

  // Function to navigate to product details
  const navigateToProductDetails = (item = null) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  // Function to navigate to purchase screen
  const navigateToPurchase = () => {
    if (cartItems.length === 0) {
      Alert.alert('Your cart is empty!');
      return;
    }
    // titles of each item
    const titles = cartItems.map(item => item.title);
    // navigate to purchase screen
    navigation.navigate('PurchaseScreen', { titles, totalPrice });
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  // animate the image
  const handleImageLoad = (id = null) => {
    Animated.spring(imageAnimValues.current[id], {
      toValue: 0,
      friction: 10,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };
    
      // Render the list items
  const renderSwipeItem = ({ item = null, index = null }) => {
    if (!imageAnimValues.current[item.id]) {
        imageAnimValues.current[item.id] = new Animated.Value(-1);
    }
    // Get the animated value for the image
    const imageAnim = imageAnimValues.current[item.id];
    // Check if the item is in the collab list
    return (
      <Animated.View>
        <List.Item
            key={item.id}
            title={item.title}
            description={() => (
            <View>
                <Text>${item.price}</Text>
            </View>
            )}
            titleNumberOfLines={1} // Specify the number of lines
            titleEllipsizeMode='tail'
            left={() =>
            <View style={{ position: 'relative' }}>
                <View style={{ 
                width: 80, 
                height: 80, 
                marginLeft: 5, 
                marginTop: -10, 
                marginBottom: -10,
                borderRadius: 50,
                backgroundColor: '#f2f2f2', 
                justifyContent: 'center', 
                alignItems: 'center' 
                }}>
                </View>
                <Animated.Image
                source={item.image ? { uri: item.image } : 'https://via.placeholder.com/150'}
                onRightActionStatusChange={() => console.log('onRightActionStatusChange')}
                style={[styles.listImage,
                    { 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transform: [{ translateX: imageAnim.interpolate({
                        inputRange: [-1, 0],
                        outputRange: [-useWindowDimensions().width, 0]
                    }) 
                    }] 
                }]}
                onLoad={() => handleImageLoad(item.id)}
                resizeMode="contain"
                />
            </View>
            }
            onPress={() => navigateToProductDetails(item)}
            style={[styles.listItem, { backgroundColor: '#f9f9f9' }]}
            titleStyle={styles.title}
        />
      </Animated.View>
    )
  }
    
  const renderHiddenItem = (data = null, rowMap = null) => {
    return (
      <View style={styles.hiddenContainer}>
        {/* Right Swipe Action for items in the custom list */}
        <IconButton
            icon="cart-minus"
            iconColor="#de5454"
            size={72}
            onPress={() => {
                handleRemoveItem(rowMap, data.item.id)
            }}
            style={[styles.iconButton]}
        />
      </View>
    );
  };  

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cart-outline" size={100} color="#888" />
            <Text style={styles.emptyText}>Your cart is empty!</Text>
          </View>
        ) : (
          <SwipeListView
            data={cartItems}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={renderSwipeItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={100} // Width of left swipe actions
            rightOpenValue={-100} // Width of right swipe actions
            disableLeftSwipe={true}
          />
        )}
      </GestureHandlerRootView>

     {/* BottomSheet for help */}
      <BottomSheet
        ref={helpSheetRef}
        index={0}
        snapPoints={[1, '50%']}
        style={[styles.bottomSheet, { marginTop: 5 }]}
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 20,
            marginHorizontal: 20,
          }}>
            Instructions
          </Text>
          <View style={{ 
              borderBottomColor: '#ccc', 
              borderBottomWidth: 1, 
              marginHorizontal: 20,
              marginTop: 10,
          }} />
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <FlatList
              data={helpGuide}
              renderItem={({ item = null }) => (
                <View style={styles.itemContainer}>
                  <Text>
                    {item.text}
                  </Text>
                </View>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </BottomSheet>

      <View style={styles.container}>
          <View style={styles.totalContainer}>
              <Text style={styles.total}>Total:</Text>
              <Text style={styles.total}>USD ${totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.purchaseButton} onPress={() => navigateToPurchase()}>
              <Text style={styles.buttonText}>Checkout</Text>
          </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  totalContainer : {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  purchaseButton: {
    backgroundColor: 'black',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  }, 
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  listItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listImage: {
    width: 80, 
    height: 80, 
    marginLeft: 5, 
    marginTop: -10, 
    marginBottom: -10, 
    borderRadius: 50,
  },
  categorylistImage: {
    width: 80, 
    height: 80, 
    marginLeft: 5, 
    marginTop: -10, 
    marginBottom: -10, 
    borderRadius: 50
  },
  iconButton: {
    borderRadius: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    textAlign: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  hiddenContainer: {
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#888',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  topSection: {
    backgroundColor: '#de5454',
    paddingHorizontal: 15,
    paddingVertical: 45,
  },
  searchInputContainer: {
    paddingHorizontal: 15,
    marginTop: -32,
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    height: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 18,
    padding: 18,
    paddingRight: 40,
    flex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: '#888',
  },
});

export default CartScreen;