import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { Modal, TextInput } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import ProfileBox from '../components/ProfileBox';
import CustomProfileBox from '../components/UserProfileBox';
import { api } from '../utils';
import { useDropzone } from 'react-dropzone';
import { createRoot } from 'react-dom/client'
import SearchBar from '../components/SearchBar';
import AlertModal from '../components/NotLoggedInAdding';
import FilterModal from '../components/FilterModal';

const screenWidth = Dimensions.get('window').width;
const boxWidth = 150; // Set your desired profile box width
const margin = 10; // Spacing between boxes
const columns = Math.floor(screenWidth / (boxWidth + margin * 2));
const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

const App = ({/*route,*/ navigation }) => {
  const [allProfiles, setAllProfiles] = useState([]); // Keep the original list
  const [filterProfiles, setFilterProfiles] = useState([]); // Keep the list of mapped urls and their users
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // State for Creator Form
  const [creatorModal, setCreatorModal] = useState(false);
  const [creatorForm, setCreatorForm] = useState({
    profilePicture: '',
    tiktokUsername: '',
    instagramURL: '',
    xURL: '',
    facebookURL: '',
  });
  const [token, setToken] = useState(''); // State for the random token in Creator Form


  const [showRegisterModal, setShowRegisterModal] = useState(false); // State for registration modal
  // const [loading, setLoading] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);

  //const [showLoginModal, setShowLoginModal] = useState(false);

  const scrollAnim = new Animated.Value(0); // Tracks scroll (Y-axis) position
  const offsetAnim = new Animated.Value(0); // TODO Use later for snapping footer back in place
  const popupOpacity = useRef(new Animated.Value(0)).current;

  const clampedScroll = Animated.diffClamp(
    Animated.add(scrollAnim, offsetAnim),
    0,
    navbarHeight
  );

  const footerTranslate = clampedScroll.interpolate({
    inputRange: [0, navbarHeight],
    outputRange: [0, isNotificationVisible ? -navbarHeight : 0], // Adjust based on notification visibility
    extrapolate: 'clamp',
  });

  const footerOpacity = clampedScroll.interpolate({
    inputRange: [0, navbarHeight],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleFilter = () => {
    setIsFilterModalVisible(true);
  };
  
  const handleSelectPlatform = (selectedPlatforms) => {
    console.log("Selected Platforms", selectedPlatforms);
    if (selectedPlatforms.length === 0) {
      // If no platforms are selected, reset to all profiles
      setProfiles([...allProfiles]);
      return;
    }
  
    // Filter profiles based on the selected platforms
    const filteredProfiles = allProfiles.filter((profile) =>
      selectedPlatforms.every((platform) => {
        let normalizedPlatform = platform.toLowerCase();

        if (normalizedPlatform === 'x') {
          normalizedPlatform = 'twitter';
        }

        return (
          profile[`${normalizedPlatform}_url`] &&
          profile[`${normalizedPlatform}_url`].trim() !== '' &&
          profile[`${normalizedPlatform}_url`].trim() !== undefined
        );
      })
    );
  
    setProfiles(filteredProfiles);
  };

  const handleShowPopup = () => {
    setShowSavePopup(true);
    setIsNotificationVisible(true); 

    // Show popup (set opacity to 1)
    popupOpacity.setValue(1);

    // Automatically hide the popup after 5 seconds
    setTimeout(() => {
      popupOpacity.setValue(0);
      setShowSavePopup(false);
    }, 12000);
    };


  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("checking inside of search", allProfiles, profiles);
    if (query.trim() === '') {
      // If the search query is empty, reset to all profiles
      setProfiles([...allProfiles]);
    } else {
      // Filter profiles based on the search query
      const filteredProfiles = allProfiles.filter((profile) =>
      profile.UserName.toLowerCase().includes(query.toLowerCase())
    );
      setProfiles(filteredProfiles);
    }

  };

  // PlaceHolder for login
  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  //   setAccountName('Guest');
  // };

  const handleLogin = () => {
    setShowLoginModal(true); // Open the modal
  };

  const handleCheckEmail = async () => {
    const emailInput = email.trim(); // Ensure email input is trimmed
    const passwordInput = password.trim(); // Ensure password input is trimmed
    if (!emailInput || !passwordInput) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
    }

    try {
        // Send API request to check if email exists in the database
        const response = await api.post('/api/check-email/', { email: emailInput, password: passwordInput, password: passwordInput });

        if (response.status === 200) {
            const user = response.data;
            
            Alert.alert('Success', 'Login successful!');
            setIsLoggedIn(true); // Set user as logged in
            setAccountName(`${user.first_name} ${user.last_name}`); // Update account name
            setShowLoginModal(false); // Close the login modal
            setPassword(''); // Clear the password field

            // Fetch and display the following list if the JSON file exists and is not empty
            if (user.json_file && Object.keys(user.json_file).length > 0) {
                processFollowingFromJson(user.json_file);
            } 
        } else {
            Alert.alert('Error', 'Unexpected response from the server.');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            // Email not found
            Alert.alert('Error', 'Email not found. Please register first.');
        } else {
            console.error('Error checking email:', error.message);
            Alert.alert('Error', 'Incorrect password or Email. Please try again.');
        }
    }
  };


  const processFollowingFromJson = async (jsonFile) => {
    try {
      if (!jsonFile || Object.keys(jsonFile).length === 0) {
        Alert.alert('Notice', 'The JSON file is empty or invalid.');
        return;
      }

      const profile = jsonFile.Profile || {};
      const followingList = profile["Following List"]?.Following || [];

      if (followingList.length === 0) {
        //Alert.alert('Notice', 'No "following" data found in your JSON file.');
        return;
      }

        // console.log('Following List:', followingList);

      const prof = followingList.map(profile => {
        if (profile.UserName) {
          return profile.UserName;
        } else {
          console.warn('Invalid following entry, missing UserName:', profile);
          return null;
        }
      }).filter(Boolean); // Remove null values

      if (prof.length === 0) {
        Alert.alert('Notice', 'No valid usernames found in the following list.');
        return;
      }

      console.log('Usernames to map:', prof);

      // Fetch mapped profiles
      const mappedProfilesResponse = await api.post(
        '/api/profile-mapping/',
        { prof },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

        const mappedProfiles = mappedProfilesResponse.data?.profiles || [];
        // console.log('Mapped Profiles:', mappedProfiles);

      setProfiles([...mappedProfiles]);
      setAllProfiles([...mappedProfiles]);

      Alert.alert('Success', 'Profiles successfully mapped from your data!');
    } catch (error) {
      console.error('Profile processing error:', error.message);
      Alert.alert('Error', 'Failed to process profiles.');
    }
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    //setAccountName('Nicolas Saade');
    setAccountName('');
  };

  const handleFileSelect = async () => {
    if (Platform.OS === 'web') {
      return new Promise((resolve, reject) => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const root = createRoot(container);
        const handleClose = () => {
            root.unmount(); // unmount the React tree
            container.remove(); // Remove container from the DOM
        };
        const DropzoneComponent = () => {
            const onDrop = (acceptedFiles) => {
                if (acceptedFiles.length > 0) {
                    resolve(acceptedFiles[0]); // Resolve with the selected file
                    handleClose(); // Cleanup the modal
                } else {
                    reject(new Error('No file selected'));
                    handleClose();
                }
            };
            const { getRootProps, getInputProps, isDragActive } = useDropzone({
                onDrop,
                accept: '.json', // Accept only JSON files
                maxFiles: 1, // Single file
            });
            return (
                <div
                    {...getRootProps()}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Drop the file here...</p>
                        ) : (
                            <p>Drag & drop a JSON file here, or click to select one</p>
                        )}
                        <button
                            onClick={handleClose}
                            style={{
                                marginTop: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            );
        };
        root.render(<DropzoneComponent />);
    });
    } else {
      // Native-specific file picker using react-native-document-picker
      const DocumentPicker = await import('react-native-document-picker'); // Dynamically import
      try {
        const results = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles], // Adjust file type validation if needed
        });
        return results[0]; // Return the first selected file
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User canceled the picker --> no action needed
        } else {
          Alert.alert('Something went wrong with file picking', err.message);
        }
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
        setAccountName(firstName + ' ' + lastName); // Optionally set the user's name
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
            });

            const formData = new FormData();
            if (Platform.OS === 'web') {
                formData.append('file', file);
            } else {
                formData.append('file', {
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                });
            }

            // Include user email if logged in
            if (email) {
                formData.append('email', email);
            }

            response = await api.post('/api/upload-json/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response?.status === 200) {
                Alert.alert('Success', response.data?.message || `File "${file.name}" uploaded successfully!`);
            } else {
                console.error('Error response:', response?.data);
                Alert.alert('Error', response?.data?.error || 'An error occurred while uploading the file.');
                return;
            }
        } else {
            Alert.alert('Error', 'No file was selected.');
            return;
        }
    } catch (error) {
        console.error('File upload error:', error.message);
        if (error.response) {
            Alert.alert('Error', error.response?.data?.error || 'An unexpected error occurred.');
        } else {
            Alert.alert('Error', 'An unexpected error occurred.');
        }
        return;
    }

    // Process following data after a successful file upload
    try {
        const { following } = response?.data || {};
        console.log('Following data:', following);

        if (following && Array.isArray(following)) {
            const prof = following
                .map(profile => profile.UserName || null) // Map valid usernames or null
                .filter(Boolean); // Remove null values

            if (prof.length === 0) {
                Alert.alert('Error', 'No valid usernames found in the following list.');
                return;
            }

            const chunkArray = (array) => {
              const result = [];
              for (let i = 0; i < array.length; i += 100) { // Maybe we Decide to change the 100 to smth smaller
                  result.push(array.slice(i, i + 100));
              }
              return result;
            }

            const profileChunks = chunkArray(prof);
            const mappedProfiles = [];

            for (const chunk in profileChunks) {
              try{
                const mappedProfilesResponse = await api.post(
                    '/api/profile-mapping/',
                    { prof: profileChunks[chunk] },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                mappedProfiles.push(...mappedProfilesResponse.data?.profiles || []);

              } catch (error) {
                console.error('Chunk Profile mapping error:', error.response?.data || error.message);
                Alert.alert('Error', 'Failed to process profiles.');
              }
            }

            console.log('Mapped Profiles:', mappedProfiles);

            setProfiles([...mappedProfiles]);
            setAllProfiles([...mappedProfiles]);
            
            if (!isLoggedIn) {
              setShowSavePopup(true);
              handleShowPopup();
            }

            Alert.alert('Success', 'Profiles successfully mapped!');
        } else {
            Alert.alert('Error', 'No "following" data found in the uploaded JSON file.');
        }
    } catch (error) {
        if (error instanceof SyntaxError) {
            Alert.alert('Error', 'Failed to parse the JSON file. Ensure the file contains valid JSON.');
        } else {
            console.error('Profile mapping error:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to process profiles.');
        }
    }
};



  const handleBulkFollow = (platform) => {
    Alert.alert('Bulk Follow', `Following all users on ${platform}!`);
    // API call or bulk follow implementation here
  };


  // Creator Form Submission
  const submitCreatorData = async () => {
    try {
      const payload = { ...creatorForm, token }; // Form data + token
      const response = await api.post('/api/creator-data/', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Social Media Data Submitted!');
        setCreatorModal(false); // Close the modal
        setCreatorForm({ // Reset form state
          profilePicture: '',
          tiktokUsername: '',
          instagramURL: '',
          xURL: '',
          facebookURL: '',
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit social media data.")
    }
  }

  // Helper Function to generate a random string
  const generateToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let result = '';
    for (let i = 0; i < 8; i++) { // random 8-char str
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Generate token when Creator modal is opened
  useEffect(() => {
    if (creatorModal) {
      setToken(generateToken());
    }
  }, [creatorModal]);



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

          <SearchBar
            onSearch={handleSearch}
            placeholder="Search..."
          />

          {allProfiles.length !== 0 && (
              <TouchableOpacity
                onPress={handleFilter}
                style={styles.filterButton}
              >
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            onPress={handleFileDrop}
            style={allProfiles === null ? styles.changeFileButtonSmall : styles.changeFileButton}>
            <Text style={allProfiles.length !== 0 ? styles.changeFileTextSmall : styles.changeFileText}>
              {allProfiles.length !== 0 ? 'Change File' : 'Add TikTok File'}
            </Text>
          </TouchableOpacity>

          {/* <BulkFollowDropdown onSelectPlatform={handleBulkFollow} /> */}
        </View>

        {/* Dynamic Profile Boxes */}
        <Animated.ScrollView
          style={styles.profilesContainer}
          onScroll={Animated.event( // Event listener for scroll
            [{ nativeEvent: { contentOffset: { y: scrollAnim } } }], // bounds the scrollAnim value to the Y-axis scroll position
            { useNativeDriver: true, }
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

            {/* Add the custom box at the end */}
            <View style={styles.profileWrapper}>
              <TouchableOpacity
                style={styles.customBox}
                onPress={() => {
                  if (isLoggedIn) {
                    setCreatorModal(true); // Open the Creator Modal if logged in
                  } else {
                    setShowAlertModal(true); // Show custom alert modal
                  }
                }}
              >
                <View style={styles.profileWrapper}>
                  <CustomProfileBox
                    name={(accountName.trim()) ? `${accountName}` : 'Your Account'}
                  />
                </View>
              </TouchableOpacity>
            </View>
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
              <Text style={styles.footerText}>SignUp/Login</Text>
            </TouchableOpacity>
          )}
          {/* Popup Modal */}

        {/* Subtle Notification Popup */}
        {showSavePopup && (
          <TouchableOpacity
            style={[styles.notificationPopup]}
            activeOpacity={0.9} // Add a bit of feedback when clicked
            onPress={() => {
              popupOpacity.setValue(0);
              setShowSavePopup(false);
              setIsNotificationVisible(false); // Hide notification
            }} // Dismiss the popup
          >
            <Text style={styles.notificationText}>
              To save this list and your preferences, SignUp/Login, and we’ll take care of the rest!!
            </Text>
          </TouchableOpacity>
        )}
        </View>

        <TouchableOpacity style={styles.footerCenter}>
          <Text style={styles.footerText}>{accountName}</Text>
        </TouchableOpacity>
          
        <AlertModal
          visible={showAlertModal}
          title="Login Required"
          message="Please log in to add your accout's credentials."
          onClose={() => setShowAlertModal(false)} // Close modal on button press
        />

        <View style={styles.footerRight}>
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
            <Text style = {styles.message}>With an account, we can take care of your data file, so you can focus on migrating your preferences.</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail} // Update state
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
                onPress={() => setShowLoginModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleCheckEmail} // Call handleCheckEmail instead of handleLogin
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


      {/* Creator Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={creatorModal}
        onRequestClose={() => setCreatorModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Social Media Details</Text>
            <Text style={styles.message}>
                Please send the code "<Text style={styles.token}>{token}</Text>" to this TikTok Account:{' '}
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.tiktok.com/@example')}>
                https://www.tiktok.com/@example
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Profile Picture URL"
              value={creatorForm.profilePicture}
              onChangeText={(text) => setCreatorForm((prev) => ({ ...prev, profilePicture: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="TikTok Username"
              value={creatorForm.tiktokUsername}
              onChangeText={(text) => setCreatorForm((prev) => ({ ...prev, tiktokUsername: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Instagram URL"
              value={creatorForm.instagramURL}
              onChangeText={(text) => setCreatorForm((prev) => ({ ...prev, instagramURL: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="X (Twitter) URL"
              value={creatorForm.xURL}
              onChangeText={(text) => setCreatorForm((prev) => ({ ...prev, xURL: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Facebook URL"
              value={creatorForm.facebookURL}
              onChangeText={(text) => setCreatorForm((prev) => ({ ...prev, facebookURL: text }))}
            />

            {/* Buttons Row */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCreatorModal(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => submitCreatorData()}
              >
                <Text style={styles.registerButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onSelectPlatform={handleSelectPlatform} // Pass handleSelectPlatform to the modal
      />

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
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backArrow: {
    fontSize: 24,
    color: '#007bff',
  },
  changeFileButton: {
    backgroundColor: '#4CAF50', // Original button background
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  
  changeFileText: {
    color: '#fff', // Original button text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  changeFileButtonSmall: {
    backgroundColor: '#ddd !important', // Light gray background for less prominence
    paddingVertical: 6, // Smaller padding
    paddingHorizontal: 10, // Smaller width
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc', // Subtle border
  },
  
  changeFileTextSmall: {
    color: '#555', // Subtle gray text
    fontSize: 12, // Smaller font size
    fontWeight: 'normal', // Normal font weight
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
    flexBasis: isMobile ? '48%' : `${100 / columns}%`,
    marginBottom: isMobile ? 3 : 10,
    paddingHorizontal: isMobile ? 2 : 8,
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
  message: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  token: {
    fontWeight: 'bold',
    color: '#FF5722',
  },
  notificationPopup: {
    position: 'absolute',
    bottom: 40, // Position above the bottom edge
    left: 20, // Margin from the left
    right: 20, // Margin from the right
    backgroundColor: '#FFF',
    padding: 15, // Padding for internal spacing
    borderRadius: 10, // Rounded corners
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minHeight: 110, // Ensure enough height for the content
    minWidth: 120, // Ensure enough width for the
    maxWidth: '90%', // Limit the width to 90% of the screen
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically center the content
    justifyContent: 'space-between', // Add spacing between text and button
  },
  notificationText: {
    flex: 1, // Prevent text from shrinking
    fontSize: 16, // Larger text size
    color: '#333',
    textAlign: 'left', // Left-align the text
  },
  greenPlusButton: {
    backgroundColor: '#4CAF50', // Green background
    borderRadius: 50, // Circular button
    width: 30, // Button width
    height: 20, // Button height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    position: 'absolute', // Place it in a fixed position
    right: 15, // Distance from the right edge of the footer
    bottom: 10, // Distance from the bottom edge of the screen
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow radius
  },
  
  plusText: {
    color: '#fff', // White text color
    fontSize: 14, // Font size
    fontWeight: 'bold', // Bold font
  },
  filterButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});


export default App;