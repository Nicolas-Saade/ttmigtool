require('dotenv').config();
const admin = require('firebase-admin');
const fs = require('fs');

// Read the private key from the file path defined in the .env file
const serviceAccountPath = process.env.FIREBASE_KEY_PATH;
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: privateKey,
    }),
    databaseURL: 'https://tiktokparser-80fbd.firebaseio.com', // Replace with your actual databaseURL
  });

const db = admin.firestore();

module.exports = { db };