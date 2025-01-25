import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { openUrl } from '../utils';
import facebookIcon from '../assets/Facebook-logo-reg.png'; // Regular Facebook icon
import facebookIconPlaceholder from '../assets/facebook-logo-not.png'; // Placeholder for missing URL
import instagramIcon from '../assets/Insta-logo-reg.png'; // Regular Instagram icon
import instagramIconPlaceholder from '../assets/Insta-logo-not.png'; // Placeholder for missing URL
import twitterIcon from '../assets/X-logo-reg.webp'; // Regular X (Twitter) icon
import twitterIconPlaceholder from '../assets/X-logo-not.png'; // Placeholder for missing URL
import redditIcon from '../assets/reddit-logo-reg.webp'; // Regular Reddit icon
import redditIconPlaceholder from '../assets/reddit-logo-not.png'; // Placeholder for missing URL
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
          <TouchableOpacity 
              onPress={() => facebookUrl && openUrl(facebookUrl)} 
              disabled={!facebookUrl} // Disable button if URL is null
          >
            <Image 
              source={facebookUrl ? facebookIcon : facebookIconPlaceholder} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => instagramUrl && openUrl(instagramUrl)} 
            disabled={!instagramUrl} // Disable button if URL is null
          >
            <Image 
              source={instagramUrl ? instagramIcon : instagramIconPlaceholder} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => twitterUrl && openUrl(twitterUrl)} 
            disabled={!twitterUrl} // Disable button if URL is null
          >
            <Image 
              source={twitterUrl ? twitterIcon : twitterIconPlaceholder} 
              style={styles.icon} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => redditUrl && openUrl(redditUrl)} 
            disabled={!redditUrl} // Disable button if URL is null
          >
            <Image 
              source={redditUrl ? redditIcon : redditIconPlaceholder} 
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