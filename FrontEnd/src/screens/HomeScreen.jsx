import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { SafeAreaView } from 'react-native';
import RNFS from 'react-native-fs';
import ModalDropdown from 'react-native-modal-dropdown';
import ProfileBox from '../components/ProfileBox';

const App = ( {route, navigation} ) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState('Guest');
  const [profiles, setProfiles] = useState([]);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const scrollAnim = new Animated.Value(0); // Tracks scroll (Y-axis) position
  const offsetAnim = new Animated.Value(0); // TODO Use later for snapping footer back in place

  const clampedScroll = Animated.diffClamp( // Value used for footer translation and opacity interpolation
    Animated.add(scrollAnim, offsetAnim),
    0,
    navbarHeight
  );

  const footerTranslate = clampedScroll.interpolate({
    inputRange: [0, navbarHeight], // UpperBounded by diffClamp
    outputRange: [0, -navbarHeight], // Move footer up by its height (hide it)
    extrapolate: 'clamp', // Disables extrapolation (limits the interpolation output)
  });

  const footerOpacity = clampedScroll.interpolate({
    inputRange: [0, navbarHeight],
    outputRange: [1, 0], // 1:Opaque-2:Transparent
    extrapolate: 'clamp',
  });

  // PlaceHolder for login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setAccountName('Nicolas Saade');
  };

  const handleFileSelect = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // TODO check what do with input validation
      });
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

  const handleBulkFollow = (platform) => {
    Alert.alert('Bulk Follow', `Following all users on ${platform}!`);
    // API call or bulk follow implementation here
  };

  const BulkFollowDropdown = ({ onSelectPlatform }) => (
    <ModalDropdown
      options={['Twitter', 'Facebook', 'Instagram']}
      dropdownStyle={styles.dropdown}
      onSelect={(index, value) => onSelectPlatform(value)}
    >
      <TouchableOpacity style={styles.bulkFollowButton}>
        <Text style={styles.bulkFollowText}>Bulk Follow</Text>
      </TouchableOpacity>
    </ModalDropdown>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <BulkFollowDropdown onSelectPlatform={handleBulkFollow} />
        </View>
  
        {/* Dynamic Profile Boxes */}
        <Animated.ScrollView
          style={styles.profilesContainer}
          onScroll={Animated.event( // Event listener for scroll
            [{ nativeEvent: { contentOffset: { y: scrollAnim } } }], // bounds the scrollAnim value to the Y-axis scroll position
            {useNativeDriver: true,}
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
      </View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              transform: [{ translateY: footerTranslate }], // Applying translation
              opacity: footerOpacity, // Applying opacity
            },
          ]}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setNavbarHeight(height); // Just to get the height of the footer
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
    </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backArrow: {
    fontSize: 24,
    color: '#007bff',
  },
  bulkFollowButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bulkFollowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
}
);

export default App;