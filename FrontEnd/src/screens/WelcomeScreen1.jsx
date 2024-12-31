import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello There! 👋</Text>
      <Text style={styles.subtitle}>
        This app was built during a college student's free time with love and dedication. 
        It's here to help us stay connected and thrive together as a community. Let's keep the joy alive 
        and support one another 💙.
      </Text>
      <Text style={styles.subtitle}>
        Thank you for giving this app a try! If you love it, I won't ask you for money 
        or a cup of coffee, but to for you to recommend it to your loved ones :).
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WelcomeScreen2')}
      >
        <Text style={styles.buttonText}>Let's Get Started</Text>
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
    backgroundColor: '#f9f9f9', // Soft, inviting background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Warm, neutral color
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: '#4CAF50', // Friendly green button
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