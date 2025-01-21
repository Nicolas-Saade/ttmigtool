import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Protect Your TikTok Faves!</Text>
      <Text style={styles.subtitle}>
        A tool to migrate your Tiktok preferences to a new platform.
      </Text>
      <Text style={styles.note}>
        Note from creator: I built this service with love and dedication 
        to help us stay connected and thrive as a community in these uncertain times.
        I’m Nicolas, a college student, and I built this during my free time to safeguard the 
        small daily joy and personalized fun that Tiktok brings me, in case it ever gets banned.
        I promise to keep this service free, and if you like it, 
        please share it with your network and loved ones!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WelcomeScreen2')}
      >
        <Text style={styles.buttonText}>Tutorial</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('HomeScreen')}
      >
        <Text style={styles.buttonText}>Migrate My Data</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  note: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
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

export default WelcomeScreen1;