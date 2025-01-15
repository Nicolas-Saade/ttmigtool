// src/utils/filePicker.js
import { Platform } from 'react-native';

export const filePicker = async () => {
  if (Platform.OS === 'web') {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          resolve(files[0]);
        } else {
          reject(new Error('No file selected'));
        }
      };
      input.click();
    });
  } else {
    const DocumentPicker = await import('react-native-document-picker'); // Dynamically import for native platforms
    try {
      return await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled file picker');
        return null;
      }
      throw err;
    }
  }
};