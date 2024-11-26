import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  Dimensions 
} from 'react-native';
import fetchMoviesData from '@/constants/common';


const MovieListScreen = () => {
  const moviesData = {
"To Watch":[{"movieId":1,"title":"Inception","poster_url":"https://picsum.photos/id/237/200/300","updatedAt":"2024-07-21"},{"movieId":3,"title":"Breaking Bad","poster_url":"https://picsum.photos/id/238/200/300","updatedAt":"2024-07-22"},{"movieId":5,"title":"Stranger Things","poster_url":"https://picsum.photos/id/239/200/300","updatedAt":"2024-07-23"},{"movieId":7,"title":"The Dark Knight","poster_url":"https://picsum.photos/id/240/200/300","updatedAt":"2024-07-24"},{"movieId":9,"title":"Friends","poster_url":"https://picsum.photos/id/241/200/300","updatedAt":"2024-07-25"},{"movieId":11,"title":"Avatar","poster_url":"https://picsum.photos/id/242/200/300","updatedAt":"2024-07-26"},{"movieId":13,"title":"Game of Thrones","poster_url":"https://picsum.photos/id/243/200/300","updatedAt":"2024-07-27"},{"movieId":15,"title":"Parasite","poster_url":"https://picsum.photos/id/244/200/300","updatedAt":"2024-07-28"},{"movieId":17,"title":"The Mandalorian","poster_url":"https://picsum.photos/id/245/200/300","updatedAt":"2024-07-29"},{"movieId":19,"title":"The Matrix","poster_url":"https://picsum.photos/id/246/200/300","updatedAt":"2024-07-30"},{"movieId":21,"title":"The Witcher","poster_url":"https://picsum.photos/id/247/200/300","updatedAt":"2024-08-01"},{"movieId":23,"title":"Pulp Fiction","poster_url":"https://picsum.photos/id/248/200/300","updatedAt":"2024-08-02"},{"movieId":25,"title":"Westworld","poster_url":"https://picsum.photos/id/249/200/300","updatedAt":"2024-08-03"},{"movieId":27,"title":"The Shawshank Redemption","poster_url":"https://picsum.photos/id/250/200/300","updatedAt":"2024-08-04"},{"movieId":29,"title":"The Office","poster_url":"https://picsum.photos/id/251/200/300","updatedAt":"2024-08-05"}],Watched:[{"movieId":2,"title":"Interstellar","poster_url":"https://picsum.photos/id/252/200/300","updatedAt":"2024-07-21"},{"movieId":4,"title":"Fight Club","poster_url":"https://picsum.photos/id/253/200/300","updatedAt":"2024-07-22"},{"movieId":6,"title":"Sherlock","poster_url":"https://picsum.photos/id/254/200/300","updatedAt":"2024-07-23"},{"movieId":8,"title":"The Godfather","poster_url":"https://picsum.photos/id/255/200/300","updatedAt":"2024-07-24"},{"movieId":10,"title":"House of Cards","poster_url":"https://picsum.photos/id/256/200/300","updatedAt":"2024-07-25"},{"movieId":12,"title":"The Silence of the Lambs","poster_url":"https://picsum.photos/id/257/200/300","updatedAt":"2024-07-26"},{"movieId":14,"title":"Better Call Saul","poster_url":"https://picsum.photos/id/258/200/300","updatedAt":"2024-07-27"},{"movieId":16,"title":"The Lord of the Rings","poster_url":"https://picsum.photos/id/259/200/300","updatedAt":"2024-07-28"},{"movieId":18,"title":"The Boys","poster_url":"https://picsum.photos/id/260/200/300","updatedAt":"2024-07-29"},{"movieId":20,"title":"Goodfellas","poster_url":"https://picsum.photos/id/261/200/300","updatedAt":"2024-07-30"},{"movieId":22,"title":"Gladiator","poster_url":"https://picsum.photos/id/262/200/300","updatedAt":"2024-08-01"},{"movieId":24,"title":"Schindler’s List","poster_url":"https://picsum.photos/id/263/200/300","updatedAt":"2024-08-02"},{"movieId":26,"title":"Black Mirror","poster_url":"https://picsum.photos/id/264/200/300","updatedAt":"2024-08-03"},{"movieId":28,"title":"Breaking Bad","poster_url":"https://picsum.photos/id/265/200/300","updatedAt":"2024-08-04"},{"movieId":30,"title":"Chernobyl","poster_url":"https://picsum.photos/id/266/200/300","updatedAt":"2024-08-05"}]}



  const [activeSection,setActiveSection] = useState('To Watch')
  const [Data,setUser]  = useState([])

  const getWatchList = async () => {
    const API = 'https://api.rapidmock.com/api/vikuman/v1/mylist';
    try {
      const userWatchlist = await fetchMoviesData(API);
      console.log('API Response:', userWatchlist);
      setUser(userWatchlist?.['To Watch'] || [])
      console.log('Watchlist:', userWatchlist?.watchlist);
    } catch (error) {
      console.log(error)
    }
    
  };

  useEffect(() => {
    getWatchList();
  }, []);
  console.log("object1", moviesData)

  
  const renderMovieItem = ({ item }) => (
    <View style={styles.movieItem}>
      <View style={styles.posterContainer}>
        <Image 
          source={{ uri: item.poster_url }} 
          style={styles.poster} 
          blurRadius={1}
        />
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.movieDate}>
          Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Movies</Text>
      </View>
      <View style={styles.sectionSelector}>
        {Object.keys(moviesData).map(section => (
          <TouchableOpacity 
            key={section}
            style={[
              styles.sectionSelectorItem,
              activeSection === section && styles.activeSectionSelector
            ]}
            onPress={() => setActiveSection(section)}
          >
            <Text style={styles.sectionSelectorText}>{section}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={moviesData[activeSection]}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.movieId.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    // flex:,
    paddingTop: 30,
    paddingBottom: 0,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    // paddingLeft:50,
    alignItems:'center',
    justifyContent:'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  sectionSelectorItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 20,
  },
  activeSectionSelector: {
    backgroundColor: '#e0e0e0',
  },
  sectionSelectorText: {
    color: 'black',
    fontWeight: '600',
  },
  movieItem: {
    width: Dimensions.get('window').width / 2 - 32,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: 250,
  },
    movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    marginBottom: 4,
  },
  movieDate: {
    color: '#888',
    fontSize: 12,
  },
});

export default MovieListScreen;