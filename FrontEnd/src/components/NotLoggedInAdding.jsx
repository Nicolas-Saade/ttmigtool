import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

const AlertModal = ({ visible, onClose }) => {
  const popupOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show popup (set opacity to 1)
      Animated.timing(popupOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Automatically hide the popup after 5 seconds
      setTimeout(() => {
        Animated.timing(popupOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      }, 5000);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.modalContainer, { opacity: popupOpacity }]}>
      <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
        <Text style={styles.closeIconText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Login Required</Text>
      <Text style={styles.modalMessage}>Please log in to add your account's credentials.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 5,
    backgroundColor: '#f44336',
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default AlertModal;