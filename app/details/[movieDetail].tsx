import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import fetchMoviesData from '@/constants/common';
import { useNavigation } from '@react-navigation/native';

const MovieDetailScreen = () => {
  const { movieid } = useLocalSearchParams();
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


  const getDetails = async () => {
    try {
      const API = `https://api.rapidmock.com/api/vikuman/v1/movies?id=${movieid}`;
      const data = await fetchMoviesData(API);
      setMovieData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetails();
    console.log(typeof document);
  }, [movieid]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!movieData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load movie details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: movieData.poster_url }} 
        style={styles.poster}
        resizeMode="cover"
      />
      {/* <View style={styles.topBox}>
        <Text style={styles.topBoxText}>This is a top box</Text>
      </View> */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movieData.title}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Rating: {movieData.rating}/10</Text>
          <Text style={styles.infoText}>Release: {movieData.release_date}</Text>
        </View>
        <Text style={styles.genre}>
          {movieData.genre.join(' • ')}
        </Text>
        <Text style={styles.description}>{movieData.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  poster: {
    width: '100%',
    height: 500,
  },
  detailsContainer: {
    padding: 15,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoText: {
    color: '#888',
    fontSize: 16,
  },
  genre: {
    color: '#4CAF50',
    marginBottom: 10,
    fontSize: 16,
  },
  description: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  topBox: {
    position: 'absolute', // Makes it float
    top: 0, // Aligns it to the top
    width: '100%', // Full width of the screen
    height: 50, // Adjust height as needed
    backgroundColor: 'blue', // Change color as needed
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    zIndex: 10, // Ensures it stays above other content
  },
  topBoxText: {
    color: 'white', // Text color
    fontSize: 16,
  },
});

export default MovieDetailScreen;

MovieDetailScreen.navigationOptions = {
  title: 'My Movie Screen Title',
};