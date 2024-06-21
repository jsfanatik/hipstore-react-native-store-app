import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions, LayoutAnimation } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const imageAnimValues = useRef({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: 'Favorites',
      headerTintColor: '#333',
    });
  }, [navigation]);

  // Get favorites from async storage
  const getFavorites = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    setFavorites(favorites ? JSON.parse(favorites) : []);
  };

  // Get favorites when the screen is focused
  useFocusEffect(
    useCallback(() => {
      getFavorites();
    }, [])
  );

  //remove item from favorites
  const handleRemoveItem = async (rowMap, rowKey) => {
    // get the list without the item
    const updateList = favorites.filter(item => item.id !== rowKey);
    // remove item from AsyncStorage
    await AsyncStorage.setItem('favorites', JSON.stringify(updateList));
    // animate the list
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // update the state
    setFavorites(updateList);
    // close the row
    if (rowMap[rowKey] && rowMap[rowKey].closeRow) {
      rowMap[rowKey].closeRow();
    }
  };

  const navigateToProductDetails = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  // animate the image
  const handleImageLoad = (id) => {
    Animated.spring(imageAnimValues.current[id], {
      toValue: 0,
      friction: 10, // Controls "bounciness"/overshoot. Default 7.
      tension: 80, // Controls speed. Default 40.
      useNativeDriver: true,
    }).start();
  };

  // Render the list items
  const renderSwipeItem = ({ item, index }) => {
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

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.hiddenContainer}>
        <IconButton
          icon="heart-minus"
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="heart-outline" size={100} color="#888" />
          <Text style={styles.emptyText}>No favorites yet!</Text>
        </View>
      ) : (
        <SwipeListView
          data={favorites}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderSwipeItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={100} // Width of left swipe actions
          rightOpenValue={-100} // Width of right swipe actions
          disableLeftSwipe={true}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#de5454', // Adjust the color to match your design
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
});