import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SectionList, StyleSheet, View, Text, FlatList } from 'react-native';
import { SearchBar, Card } from 'react-native-elements';
// import { useNavigation } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState([]);

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        categorizeProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const categorizeProducts = (products) => {
    const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
    const categorizedProducts = categories.map(category => ({
      title: category,
      data: products.filter(product => product.category === category)
    }));
    setSections(categorizedProducts);
  };

  const renderProduct = ({ item }) => (
    <Card containerStyle={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetails')}>
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

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <SectionList
        sections={sections}
        renderItem={({ item }) => null} // Render nothing here, handled by renderSection
        renderSectionHeader={({ section }) => null} // Render nothing here, handled by renderSection
        keyExtractor={(item, index) => item + index}
        contentContainerStyle={styles.listContainer}
        renderSectionFooter={renderSection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    borderRadius: 20,
    padding: 10,
    paddingTop: 30,
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
    // backgroundColor: '#f0f0f0',
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

// import React from 'react';
// import { Image, StyleSheet, Platform } from 'react-native';
// import { SearchBar } from 'react-native-elements';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   const [search, setSearch] = React.useState('');

//   const updateSearch = (search) => {
//     setSearch(search);
//   };

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           Tap the Explore tab to learn more about what's included in this starter app.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           When you're ready, run{' '}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });
