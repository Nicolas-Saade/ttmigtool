import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { openUrl } from '../utils';
import facebookIcon from '../assets/fb-emb-img.webp';
import instagramIcon from '../assets/insta-emd-img.webp';
import twitterIcon from '../assets/X-emb-img.png';
import redditIcon from '../assets/reddit-emb-img.png';
import placeHolder from '../assets/Neutral-placeholder-profile.jpg';

const ProfileBox = ({ name, profilePicture, instagramUrl, facebookUrl, twitterUrl, redditUrl }) => {
  return (
    <View style={styles.box}>
      <View style={styles.row}>
        {/* Profile Picture */}
        <Image 
          source={{ uri: profilePicture || placeHolder }} // Placeholder for profile picture
          style={styles.image} 
        />
        {/* Social Media Icons */}
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={() => openUrl(facebookUrl)}>
            <Image 
              source={facebookIcon} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openUrl(instagramUrl)}>
            <Image 
              source={instagramIcon} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openUrl(twitterUrl)}>
            <Image 
              source={twitterIcon} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openUrl(redditUrl)}>
            <Image 
              source={redditIcon} 
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