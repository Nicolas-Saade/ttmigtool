import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileBox = ({ name }) => {
  return (
    <View style={styles.box}>
      <Image 
        source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder for profile picture
        style={styles.image} 
      />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Image 
            source={require('../assets/fb-emb-img.webp')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            source={require('../assets/insta-emd-img.webp')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            source={require('../assets/X-emb-img.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image 
            source={require('../assets/reddit-emb-img.png')} 
            style={styles.icon} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default ProfileBox;