import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const WelcomeScreen2 = ({ navigation }) => {
  const goToHomeScreen = () => {
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App! 🎉</Text>
      <Text style={styles.subtitle}>
        Here's everything you need to get started. Choose how you'd like to learn!
      </Text>

      {/* Instructions Section */}
      <Text style={styles.sectionTitle}>📖 Prefer to Read? Follow These Steps:</Text>
      <View style={styles.stepsContainer}>
        <Text style={styles.step}>1. [Step 1 placeholder]</Text>
        <Text style={styles.step}>2. [Step 2 placeholder]</Text>
        <Text style={styles.step}>3. [Step 3 placeholder]</Text>
        <Text style={styles.step}>4. [Step 4 placeholder]</Text>
      </View>

      {/* Video Tutorial Section */}
      <Text style={styles.sectionTitle}>🎥 Prefer Watching? Check This Out:</Text>
      <Text
        style={styles.link}
        onPress={() => Linking.openURL('https://example.com/tutorial')}
      >
        Watch the Tutorial Video
      </Text>

      <TouchableOpacity style={styles.button} onPress={goToHomeScreen}>
        <Text style={styles.buttonText}>Go to Home Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  stepsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  step: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen2;