import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import fetchMoviesData from '@/constants/common';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CinemaScreen = () => {
  const [isAscending, setIsAscending] = useState(true);
  const [isSortActive, setIsSortActive] = useState(false);
  const flatlistRef = useRef(null);
  const [moviesList, setMoviesList] = useState([]);
  const [horizontalList, setHorizontalList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('All'); // New state for filter type
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [mainList,setMainlist] = useState([])
  const [addedMovies, setAddedMovies] = useState({});
  const navigation = useNavigation();

  const API = 'https://api.rapidmock.com/api/vikuman/v1/movies/all';
  const API_DATA = 'https://api.rapidmock.com/api/vikuman/v1/mylist/add'

  // Fetch movie data with loading and error handling
  const getData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchMoviesData(API);
      setMoviesList(response);
      setHorizontalList(response.slice(0, 4));
      setMainlist(response)
      
    } catch (error) {
      setError('Failed to load movies. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    getData();
    
  }, []);

  const handlePress = async (movieId:any) => {
    const data = {
      movieId: movieId,
      status: "To Watch",
    };
    try {
      const response = await fetch(API_DATA, {
        method: 'POST',      
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });
      if (response.ok) {
        const responseData = await response.json();
        setAddedMovies((prevState) => ({
          ...prevState,
          [movieId]: true,
        }));
        console.log('Movie added successfully:', responseData);
      } else {
        console.error('Failed to add movie:', response.status);
      }
    } catch (error) {
      console.error('Error occurred while adding movie:', error);
    }
  };

  useEffect(() => {
    if (!horizontalList.length) return;

    const interval = setInterval(() => {
      if (!flatlistRef.current) return;

      const nextIndex = activeIndex === horizontalList.length - 1 ? 0 : activeIndex + 1;

      flatlistRef.current.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0,
        viewOffset: 0,
      });

      setActiveIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, horizontalList]);

  // Filter movies/shows
  const handleFilter = (type) => {
    
    setFilterType(type);
    setIsFilterDropdownVisible(false);
     // Hide dropdown after selection
    if (type === 'All') {
      getData();
    } else {
      // getData();
      setTimeout(()=>{
      const filteredData = mainList.filter((movie) => movie.type === type.toLowerCase());
      setMoviesList(filteredData);

    },4)
    }
    
  };
  
  const handleMoviePress = (movieId) => {
    navigation.navigate('DetailsScreen', { movieId });
  };

  // Optimized search functionality
  const handleSearch = (input) => {
    const filter = input.trim().toLowerCase();

    if (!filter) {
      getData();
      return;
    }

    const filteredList = moviesList.filter((movie) =>
      movie.title.toLowerCase().includes(filter)
    );
    const remainingList = moviesList.filter(
      (movie) => !movie.title.toLowerCase().includes(filter)
    );

    setMoviesList([...filteredList, ...remainingList]);
  };
  
  // Sort movies
  const handleSort = () => {
    const sortedData = [...moviesList].sort((a, b) => {
      if (isAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    setMoviesList(sortedData);
    setIsAscending(!isAscending);
    setIsSortActive(true);
  };

  const renderFeaturedMovie = ({ item }) => (

<Link href={`/details/${item.id}`}>
    <View style={styles.featuredMovieContainer}>
      <Image
        source={{ uri: item.poster_url }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
      </View>
      </View>
     </Link>
  );

  const renderMovieCard = ({ item }) => (
    <Link href={`/details/${item.id}`} style={styles.movieCard}>
      <View>
        <Image
          source={{ uri: item.poster_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.movieDescription} numberOfLines={2}>
            {item.Description}
          </Text>
          <View style={styles.addContainer}>
  <View style={styles.typeContainer}>
    <Text style={styles.typeText}>{item.type}</Text> 
  </View>
  <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.addButton}>
  <Text style={styles.addButtonText}>{addedMovies[item.id] ? 'Added ✓' : 'Add +'}</Text>
  </TouchableOpacity>
</View>

        </View>
      </View>
    </Link>
  );
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getData}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Cinemas</Text>
          <Link href="/profile">
            <Image
              source={require('@/assets/images/icon-removebg-preview.png')}
              style={styles.profileImage}
            />
          </Link>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Movies"
          placeholderTextColor="#666"
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filterSortContainer}>
        <TouchableOpacity
          onPress={() => setIsFilterDropdownVisible(!isFilterDropdownVisible)}
          style={styles.filterButton}
        >
          <Text style={styles.filterButtonText}>{filterType}</Text>
        </TouchableOpacity>

        {isFilterDropdownVisible && (
          <View style={styles.dropdownContainer}>
            {['All', 'Movie', 'Show'].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => handleFilter(type)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity onPress={handleSort} style={[styles.sortButton, isSortActive && styles.activeSortButton]}>
          <Text style={styles.sortButtonText}>
            {isAscending ? 'Sort A-Z' : 'Sort Z-A'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces>
        <View style={styles.carouselContainer}>
          <FlatList
          
            ref={flatlistRef}
            data={horizontalList}
            renderItem={renderFeaturedMovie}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}

            onScroll={(e) => {
              const offset = e.nativeEvent.contentOffset.x;
              setActiveIndex(Math.round(offset / width));
             
            }}
         

            keyExtractor={(item) => `featured-${item.id}`}
          />
          <View style={styles.indicatorContainer}>
            {horizontalList.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === activeIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>
                
        <FlatList
          data={moviesList}
          renderItem={renderMovieCard}
          keyExtractor={(item) => `movie-${item.id}`}
          showsVerticalScrollIndicator={false}
          numColumns={2}

          

          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.movieListContainer}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 80,
    paddingTop: Platform.OS === 'android' ? 24 : 40,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 7,
    marginBottom: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 1,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  filterButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize:12
  },
  dropdownContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 12,
    color: '#000',
    fontWeight:'bold'
  },
  sortButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  activeSortButton: {
    backgroundColor: '#e0e0e0',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight:'bold',
    color: '#000',
  },
  carouselContainer: {
    height: 200,
  },
  featuredMovieContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImage: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 8,
  },
  featuredTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#000',
  },
  movieCard: {
    flex: 1,
    // justifyContent:'center',
    // alignContent:'center',
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#f4f4f4',
    overflow: 'hidden',
    height:370,
    // width:10,
  },
  image: {

    width: 144,
    height: 230,
    borderRadius:10,
    marginLeft:6
  },
  textContainer: {
    padding: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  movieDescription: {
    fontSize: 14,
    color: '#666',
  },
  typeContainer: {
    marginTop: 30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    width:60,
    marginBottom:0,
  },
  typeText: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    // width:10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#000',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  movieListContainer: {
    paddingHorizontal: 8,
  },
  separator: {
    height: 16,
  },
  addContainer: {
    // flex:1,
    flexDirection: 'row', // Align type and button in a row
    justifyContent: 'space-between', // Add space between type and button
    alignItems: 'baseline', // Center them vertically
    marginVertical: 1, // Add spacing around the container
    paddingHorizontal: 1, // Add padding on sides
  },

  addButton: {
    backgroundColor: '#0066FF',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:12
  },
});

export default CinemaScreen;
