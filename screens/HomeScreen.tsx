import React, { useEffect, useState, useRef } from 'react';
import { Image, TouchableOpacity, Animated, useWindowDimensions, SectionList, StyleSheet, View, Text, FlatList } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [heroTileImages, setHeroTileImages] = useState([]);
  const imageAnimValues = useRef({});

  const updateSearch = (search: string) => {
    setSearch(search);
    if (search.trim() === '') {
      setSearchResults([]);
    }
  };

  // fetch products
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

  // get images from women's clothing in products
  useEffect(() => {
    const jewelery = products.filter(product => product.category === "jewelery");
    setHeroTileImages(jewelery[1]);
  }, [products])

  useEffect(() => {
    console.log(heroTileImages)
  }, [heroTileImages])

  // handle text input click
  const handleTextInputClick = (searchQuery: string) => {
    if (searchQuery.trim() !== '') {
      const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  };

  // animate the image
  const handleImageLoad = (id) => {
    Animated.spring(imageAnimValues.current[id], {
      toValue: 0,
      friction: 10,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  // navigate to product details
  const navigateToProductDetails = (item) => {
    navigation.navigate('ProductDetails', { product: item });
  };

  // categorize products
  const categorizeProducts = (items) => {
    const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    const categorizedProducts = categories.map(category => ({
      title: category,
      data: items.filter(item => item.category === category)
    }));
    setSections(categorizedProducts);
  };

  // render product
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

  // render section
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
          titleNumberOfLines={1}
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

  const renderHeroTile = () => (
    <View style={styles.heroTile}>
      <Image source={{uri: heroTileImages.image}} style={styles.heroImage} />
      <Text style={styles.heroText}>Jewelry Essentials</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetails', { product: heroTileImages })}>
        <Text style={styles.heroSubtext}>Click to view product!</Text>
      </TouchableOpacity>
    </View>
  );

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
          renderItem={({ item }) => null}
          renderSectionHeader={({ section }) => null}
          keyExtractor={(item, index) => item + index}
          contentContainerStyle={styles.listContainer}
          renderSectionFooter={renderSection}
          ListHeaderComponent={renderHeroTile} 
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
    width: 160,
    marginRight: 10,
    borderRadius: 10,
  },
  heroTile: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroSubtext: {
    fontSize: 14,
    color: '#777',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
});