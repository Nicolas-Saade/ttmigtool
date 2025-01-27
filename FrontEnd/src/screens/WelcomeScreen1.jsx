import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const WelcomeScreen1 = ({ navigation }) => {
  const { height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={styles.gradientOverlay} />
      <View style={styles.content}>
        {/* Adjusted title positioning */}
        <Text
          style={[
            styles.title,
            { marginTop: height * 0.08 }, // Dynamically position based on viewport height
          ]}
        >
          Protect Your TikTok Faves!
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              top: '20%', // Centered within the gradient (adjust this percentage as needed)
            },
          ]}
        >
          Migrate your TikTok preferences to a new platform seamlessly.
        </Text>
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>A Note from the Creator</Text>
          <Text style={styles.note}>
            Hey! I'm Nicolas, a college student who built this service with love and dedication. 
            I wanted to help us stay connected and preserve the personalized joy that TikTok brings 
            to our daily lives, just in case it ever gets banned.
            {'\n\n'}
            This service will always be free - if you find it helpful, please share it with your 
            network and loved ones!
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.tutorialButton]}
            onPress={() => navigation.navigate('WelcomeScreen2')}
          >
            <Text style={styles.buttonText}>Watch Tutorial</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.migrateButton]}
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.buttonText}>Migrate My Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    opacity: 0.1,
    backgroundColor: colors.neonBlue,
    ...(Platform.OS === 'web' && {
      backgroundImage: `linear-gradient(135deg, ${colors.neonBlue}, ${colors.neonPink}, ${colors.neonPurple})`,
    }),
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    textAlign: 'center',
    zIndex: 1, // Ensure it's layered above the gradient
  },
  subtitle: {
    ...typography.h3,
    color: colors.secondaryText,
    textAlign: 'center',
    position: 'absolute', // Absolute positioning to align within the gradient
    width: '100%', // Ensures the subtitle spans across the container
    zIndex: 1, // Keeps it above the gradient
  },
  noteCard: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.neonPink,
  },
  noteTitle: {
    ...typography.h3,
    color: colors.neonPink,
    marginBottom: spacing.sm,
  },
  note: {
    ...typography.body,
    color: colors.secondaryText,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  button: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    marginBottom: spacing.md,
  },
  tutorialButton: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 2,
    borderColor: colors.neonBlue,
  },
  migrateButton: {
    backgroundColor: colors.neonBlue,
  },
  buttonText: {
    ...typography.button,
    color: colors.primaryText,
  },
});

export default WelcomeScreen1;