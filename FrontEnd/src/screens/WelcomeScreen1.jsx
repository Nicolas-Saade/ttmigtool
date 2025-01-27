import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';
import { colors, typography, spacing, shadows, borderRadius } from '../theme';

const WelcomeScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.gradientOverlay} />
      <View style={styles.content}>
        <Text style={styles.title}>Protect Your TikTok Faves!</Text>
        <Text style={styles.subtitle}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h3,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  noteCard: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
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
    gap: spacing.md,
  },
  button: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
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