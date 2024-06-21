import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Animated, useWindowDimensions, SectionList, StyleSheet, View, Text, FlatList } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const imageAnimValues = useRef({});

  const updateSearch = (search: string) => {
    setSearch(search);
    if (search.trim() === '') {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        setProducts(data);
        categorizeProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleTextInputClick = (searchQuery: string) => {
    if (searchQuery.trim() !== '') { // Ensure there's a query to search for
      // console.log('searchQuery', products.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase())))
      // setSearchResults(products.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase())));
      const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]); // Clear the search results
    }
  };

  useEffect(() => {
    console.log(searchResults)
  }, [searchResults])

  // animate the image
  const handleImageLoad = (id) => {
    Animated.spring(imageAnimValues.current[id], {
      toValue: 0,
      friction: 10, // Controls "bounciness"/overshoot. Default 7.
      tension: 80, // Controls speed. Default 40.
      useNativeDriver: true,
    }).start();
  };

  const navigateToProductDetails = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  const categorizeProducts = (items) => {
    const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    const categorizedProducts = categories.map(category => ({
      title: category,
      data: items.filter(item => item.category === category)
    }));
    setSections(categorizedProducts);
  };

  const renderProduct = ({ item }) => (
    <Card containerStyle={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: item })}>
        <Card.Image source={{ uri: item.image }} />
        <Card.Title numberOfLines={1} ellipsizeMode="tail">{item.title}</Card.Title>
        <Text style={{ marginBottom: 10 }}>
          ${item.price}
        </Text>
      </TouchableOpacity>

    </Card>
  );

  const renderSection = ({ section }) => (
    <View>
      <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>
      <FlatList
        horizontal
        data={section.data}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
      />
    </View>
  );

  const renderSearchResults = ({ item, index }) => {
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

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }} testID="homeScreenMainView">
      <SearchBar
        placeholder="Search Products..."
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        onSubmitEditing={() => {
          handleTextInputClick(search);
        }}
        returnKeyType="search"
      />
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResults}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <SectionList
        sections={sections}
        renderItem={({ item }) => null} // Render nothing here, handled by renderSection
        renderSectionHeader={({ section }) => null} // Render nothing here, handled by renderSection
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={styles.listContainer}
        renderSectionFooter={renderSection}
      />
      )}
      
    </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRadius: 20,
    padding: 10,
    paddingTop: 50,
  },
  searchInputContainer: {
    backgroundColor: '#EFEFEF',
    borderRadius: 15,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  horizontalList: {
    paddingBottom: 20,
  },
  card: {
    width: 160, // Adjust card width for horizontal scrolling
    marginRight: 10,
    borderRadius: 10,
  },
});