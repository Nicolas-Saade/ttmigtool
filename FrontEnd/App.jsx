import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  Animated,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { SafeAreaView } from 'react-native';
import RNFS from 'react-native-fs';
import ProfileBox from './src/components/ProfileBox';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState('Guest');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [profiles, setProfiles] = useState([]); // Declare state for profiles
  const [navbarHeight, setNavbarHeight] = useState(0);

  const scrollAnim = new Animated.Value(0); // HOlds curr scrollY position
  const offsetAnim = new Animated.Value(0);

  const clampedScroll = useRef(
        scrollAnim.interpolate({
          inputRange: [0, 450],
          outputRange: [0, 450],
          extrapolateLeft: 'clamp',
        }),
  ).current;

  console.log('clampedScroll:', clampedScroll);

  const footerTranslate = clampedScroll.interpolate({
    inputRange: [0, navbarHeight], // From fully visible to hidden
    outputRange: [0, -navbarHeight], // Translate down by the navbar height
    extrapolate: 'clamp', // Prevent values outside the range
  });

  const footerOpacity = clampedScroll.interpolate({
    inputRange: [0, navbarHeight], // Same range as translation
    outputRange: [1, 0], // Fully visible to fully transparent
    extrapolate: 'clamp',
  });

  // PlaceHolder for login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setAccountName('Nicolas Saade');
  };

  // PlaceHolder for logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccountName('Guest');
    setSelectedFiles([]);
  };

  const handleFileSelect = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // TODO check what do with input validation
      });
      setSelectedFiles(results);
      return results[0];
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User canceled the picker --> no action needed
      } else {
        Alert.alert('Something went wrong with file picking', err.message);
      }
    }
  };

  // PlaceHolder for file drop
  const handleFileDrop = async () => {
    const file = await handleFileSelect();
    try {
      if (file) {
        console.log('File successfully dropped and parsed:', {
          name: file.name,
          type: file.type,
          size: file.size,
          filito: file,
        });
  
        const fileContents = await RNFS.readFile(file.uri, 'utf8');

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });

        const response = await axios.post('http://127.0.0.1:8000/api/upload-json/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Response from backenddddd:', response.data);
        const { following } = response.data;

        let prof = [];

        for (const profile of following) {
          prof.push(profile.UserName);
        }

        setProfiles([...prof]);

        Alert.alert('Success', `JSON file "${file.name}" was read and parsed successfully!`);
      } else {
        Alert.alert('Error', 'No file was dropped.');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        Alert.alert('Error', 'Failed to parse the JSON file. Ensure the file contains valid JSON.');
      } else {
        Alert.alert('Error', `Failed to read the file: ${error.message}`);
      }
      console.error('File reading or parsing error:', error);
    }
  };

  const cusotmfunc = (height) => {
    console.log("NAVINAVIIIIIII:", navbarHeight);
    console.log("Height:", height);
    setNavbarHeight(height);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
  
        {/* Dynamic Profile Boxes */}
        <Animated.ScrollView
          style={styles.profilesContainer}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollAnim } } }], // Update scrollAnim
            {
              useNativeDriver: true,
              listener: (event) => {
                const scrollY = event.nativeEvent.contentOffset.y;
                console.log('Scroll Y:', scrollY, scrollAnim, clampedScroll);
                console.log("FooterTranslate:", footerTranslate);
                console.log("FooterOpacity:", footerOpacity);
              },
            }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.gridContainer}>
            {profiles.map((profile, index) => (
              <View key={index} style={styles.profileWrapper}>
                <ProfileBox name={profile} />
              </View>
            ))}
          </View>
        </Animated.ScrollView>
  
        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              transform: [{ translateY: footerTranslate }], // Slide up/down
              opacity: footerOpacity, // Fade in/out
            },
          ]}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            cusotmfunc(height);
          }}
        >
          <View style={styles.footerLeft}>
            <TouchableOpacity onPress={isLoggedIn ? handleLogout : handleLogin}>
              <Text style={styles.footerText}>
                {isLoggedIn ? 'Logout' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerCenter}>
            <Text style={styles.footerText}>{accountName}</Text>
          </View>
          <View style={styles.footerRight}>
            <TouchableOpacity onPress={handleFileDrop}>
              <Text style={styles.footerText}>Attach/Drop Files</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profilesContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileWrapper: {
    width: '48%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerLeft: {},
  footerCenter: {},
  footerRight: {},
  footerText: {
    paddingBottom: 0,
    fontWeight: 'bold',
  },
});

export default App;