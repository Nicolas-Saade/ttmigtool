import React, { useState } from 'react';
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
import { Modal, TextInput } from 'react-native';
//import RNFS from 'react-native-fs';
import ModalDropdown from 'react-native-modal-dropdown';
import ProfileBox from '../components/ProfileBox';
import { api } from '../utils';

const App = ( {/*route,*/ navigation} ) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState('Guest');
  const [profiles, setProfiles] = useState([]);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [showRegisterModal, setShowRegisterModal] = useState(false); // State for registration modal
 // const [loading, setLoading] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);

  //const [showLoginModal, setShowLoginModal] = useState(false);

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
  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  //   setAccountName('Guest');
  // };

  const handleLogin = () => {
    setShowLoginModal(true); // Open the modal
  };
  

  const handleLogout = () => {
    setIsLoggedIn(false);
    //setAccountName('Nicolas Saade');
    setAccountName('Guest');
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

  //hanlde account registration
  const handleRegister = async (firstName, lastName, email, password, file) => {
    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('password', password);
  
      if (file) {
        formData.append('json_file', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });
      }
  
      const response = await api.post('/api/create-user-profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully!');
        setShowRegisterModal(false); // Close the modal
        setIsLoggedIn(true); // Mark user as logged in
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setAccountName(firstName+ ' ' + lastName); // Optionally set the user's name
        setEmail(email);
      } else {
        Alert.alert('Error', 'Unexpected response from the server.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        Alert.alert('Error', error.response.data.error || 'Failed to create account.');
      } else {
        console.error('Error:', error.message);
        Alert.alert('Error', 'A network error occurred. Please try again.');
      }
    }
  };
  

  // PlaceHolder for file drop
  const handleFileDrop = async () => {
    const file = await handleFileSelect();
    let response = null;
    try {
      if (file) {
        console.log('File successfully dropped and parsed:', {
          name: file.name,
          type: file.type,
          size: file.size,
          filito: file,
        });

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        });

        response = await api.post('/api/upload-json/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        Alert.alert('Error', 'No file was selected');
      } 
    }catch (error) {
        Alert.alert('Error', `Failed to read @1st ENDPT: ${error.message}`);
        console.log('File error @1st ENDPT:', error.toJSON());
      }

      try{
        const { following } = response.data;

        let prof = [];

        for (const profile of following) {
          prof.push(profile.UserName);
        }

        // Use the prof list (just the list of usernames)
        const mapped_profiles_response = await api.post(
          '/api/profile-mapping/',
          { prof },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        prof = mapped_profiles_response.data['profiles'];

        setProfiles([...prof]);

        Alert.alert('Success', `JSON file "${file.name}" was read and parsed successfully!`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        Alert.alert('Error', 'Failed to parse the JSON file. Ensure the file contains valid JSON.');
      } else {
        Alert.alert('Error', `Failed to read the file: ${error.message}`);
      }
      console.error('File error @2nd ENDPT:', error.toJSON());
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
                <ProfileBox 
                  name={profile.UserName}
                  profilePicture={profile.profile_picture}
                  instagramUrl={profile.instagram_url}
                  facebookUrl={profile.facebook_url}
                  twitterUrl={profile.twitter_url}
                  redditUrl={profile.reddit_url}
                />
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
            {isLoggedIn ? (
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.footerText}>Sign Out</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.footerText}>Login</Text>
              </TouchableOpacity>
            )}
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

        <Modal
          visible={showLoginModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowLoginModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
              />
              
              {/* Buttons Row */}
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowLoginModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => Alert.alert('Login pressed')}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={() => {
                  setShowLoginModal(false); // Close login modal
                  setShowRegisterModal(true); // Open register modal
                }}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Registration Modal */}
        <Modal
          visible={showRegisterModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowRegisterModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Register</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName} // Update state
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName} // Update state
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail} // Update state
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword} // Update state
                secureTextEntry
              />

              
              {/* Buttons Row */}
              <View style={styles.buttonsRow}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowRegisterModal(false)}
                >
                  <Text style={styles.closeButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => handleRegister(firstName, lastName, email, password)}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

    </SafeAreaView>

    
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header styles
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
  // Profile grid styles
  profilesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileWrapper: {
    width: '48%',
  },
  // Footer styles
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
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  // Button styles
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default App;