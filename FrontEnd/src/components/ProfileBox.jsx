import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileBox = ({ name }) => {
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        {/* Profile Picture */}
        <Image 
          source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder for profile picture
          style={styles.image} 
        />
        {/* Social Media Icons */}
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
      {/* Username */}
      <Text style={styles.name}>{name}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center', // Centers content vertically
    justifyContent: 'space-between', // Adds spacing between the picture and icons
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center', // Centers text horizontally
  },
  iconsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around', // Spreads out icons vertically,

  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
});

export default ProfileBox;